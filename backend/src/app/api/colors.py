"""Color extraction endpoint using k-means++ algorithm."""

from io import BytesIO

import numpy as np
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile
from numpy.typing import NDArray
from PIL import Image

from app.core.config import Settings
from app.core.logging import get_logger
from app.dependencies import get_settings_dependency
from app.schemas.colors import ColorExtractionResponse, ExtractedColor

router = APIRouter()
logger = get_logger(__name__)


def kmeans_plusplus_init(
    pixels: NDArray[np.float64],
    n_clusters: int,
    rng: np.random.Generator,
) -> NDArray[np.float64]:
    """Initialize cluster centers using k-means++ algorithm."""
    n_samples = pixels.shape[0]
    centers: list[NDArray[np.float64]] = []

    # Choose first center randomly
    first_idx = rng.integers(n_samples)
    centers.append(pixels[first_idx])

    for _ in range(1, n_clusters):
        # Compute distances to nearest center
        distances = np.min(
            [np.sum((pixels - c) ** 2, axis=1) for c in centers],
            axis=0,
        )

        # Choose next center with probability proportional to distance squared
        probabilities = distances / distances.sum()
        next_idx = rng.choice(n_samples, p=probabilities)
        centers.append(pixels[next_idx])

    return np.array(centers)


def kmeans(
    pixels: NDArray[np.float64],
    n_clusters: int,
    max_iterations: int = 100,
    random_state: int = 42,
) -> tuple[NDArray[np.float64], NDArray[np.intp]]:
    """K-means clustering with k-means++ initialization."""
    rng = np.random.default_rng(random_state)

    # Initialize centers using k-means++
    centers = kmeans_plusplus_init(pixels, n_clusters, rng)

    for _ in range(max_iterations):
        # Assign pixels to nearest center
        distances = np.array([np.sum((pixels - c) ** 2, axis=1) for c in centers])
        labels = np.argmin(distances, axis=0)

        # Update centers
        new_centers = np.array([
            pixels[labels == k].mean(axis=0) if np.any(labels == k) else centers[k]
            for k in range(n_clusters)
        ])

        # Check convergence
        if np.allclose(centers, new_centers):
            break

        centers = new_centers

    return centers, labels


def extract_colors_from_image(
    image: Image.Image,
    num_colors: int,
    resize_width: int = 150,
) -> list[ExtractedColor]:
    """Extract dominant colors from image using k-means++."""
    # Resize for performance
    aspect_ratio = image.height / image.width
    new_size = (resize_width, int(resize_width * aspect_ratio))
    image = image.resize(new_size, Image.Resampling.LANCZOS)

    # Convert to RGB
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Get pixels as numpy array
    pixels = np.array(image).reshape(-1, 3).astype(np.float64)

    # Run k-means++
    centers, labels = kmeans(pixels, num_colors)

    # Calculate percentages
    unique, counts = np.unique(labels, return_counts=True)
    total_pixels = len(labels)

    results: list[ExtractedColor] = []
    for cluster_id in range(num_colors):
        r, g, b = centers[cluster_id].astype(int)
        # Clamp values to 0-255
        r = max(0, min(255, r))
        g = max(0, min(255, g))
        b = max(0, min(255, b))

        hex_color = f'#{r:02x}{g:02x}{b:02x}'

        # Get percentage for this cluster
        if cluster_id in unique:
            idx = np.where(unique == cluster_id)[0][0]
            percentage = float((counts[idx] / total_pixels) * 100)
        else:
            percentage = 0.0

        results.append(ExtractedColor(hex=hex_color, percentage=percentage))

    # Sort by percentage descending
    results.sort(key=lambda x: x.percentage, reverse=True)

    return results


@router.post('/extract', response_model=ColorExtractionResponse)
async def extract_colors(
    settings: Settings = Depends(get_settings_dependency),
    file: UploadFile = File(..., description='Image file to analyze'),
    num_colors: int = Query(default=4, ge=2, le=10, description='Number of colors to extract'),
) -> ColorExtractionResponse:
    """
    Extract dominant colors from an uploaded image using k-means++ algorithm.

    This endpoint analyzes an uploaded image and extracts the most dominant colors
    using k-means++ clustering algorithm for optimal color selection.

    Parameters:
        file: Image file (JPEG, PNG, WebP, etc.)
        num_colors: Number of colors to extract (2-10, default: 4)

    Returns:
        List of extracted colors with hex codes and percentages

    Example:
        POST /api/colors/extract?num_colors=4
        Content-Type: multipart/form-data
        -> {"colors": [{"hex": "#2563eb", "percentage": 35.2}, ...]}
    """
    logger.info('Color extraction endpoint called')
    logger.debug('API version: %s', settings.API_VERSION)

    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        logger.warning('Invalid file type: %s', file.content_type)
        raise HTTPException(status_code=400, detail='File must be an image')

    try:
        # Read image
        contents = await file.read()
        image = Image.open(BytesIO(contents))

        logger.info(
            'Extracting %d colors from image (%dx%d)', num_colors, image.width, image.height
        )

        # Extract colors
        colors = extract_colors_from_image(image, num_colors)

        return ColorExtractionResponse(colors=colors)

    except HTTPException:
        raise
    except Exception as e:
        logger.error('Color extraction failed: %s', str(e), exc_info=e)
        raise HTTPException(status_code=400, detail='Failed to process image') from e
