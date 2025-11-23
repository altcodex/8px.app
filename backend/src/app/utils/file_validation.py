"""File validation utilities for image files."""


def validate_image_magic_number(data: bytes) -> str | None:
    """
    Validate that the file is a real image by checking magic numbers.

    Supported formats:
    - PNG, JPEG, GIF, WebP, SVG, AVIF, HEIF, HEIC, TIFF, BMP

    Args:
        data: First 16+ bytes of the file

    Returns:
        Error message if validation fails, None if valid
    """
    if len(data) < 2:
        return "File is too small to be a valid image"

    # PNG: 89 50 4E 47 0D 0A 1A 0A
    if len(data) >= 8 and data[:8] == b"\x89PNG\r\n\x1a\n":
        return None

    # JPEG: FF D8 FF
    if len(data) >= 3 and data[:3] == b"\xff\xd8\xff":
        return None

    # GIF: 47 49 46 38 (GIF8)
    if len(data) >= 4 and data[:4] == b"GIF8":
        return None

    # WebP: RIFF....WEBP
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return None

    # AVIF: ....ftypavif at offset 4
    if len(data) >= 12 and data[4:12] == b"ftypavif":
        return None

    # HEIF: ....ftypheif at offset 4
    if len(data) >= 12 and data[4:12] == b"ftypheif":
        return None

    # HEIC: ....ftypheic at offset 4
    if len(data) >= 12 and data[4:12] == b"ftypheic":
        return None

    # TIFF (Little Endian): 49 49 2A 00
    if len(data) >= 4 and data[:4] == b"II*\x00":
        return None

    # TIFF (Big Endian): 4D 4D 00 2A
    if len(data) >= 4 and data[:4] == b"MM\x00*":
        return None

    # BMP: 42 4D (BM)
    if len(data) >= 2 and data[:2] == b"BM":
        return None

    # SVG: Starts with <, allowing leading whitespace and UTF-8 BOM
    offset = 0

    # Skip UTF-8 BOM if present
    if len(data) >= 3 and data[:3] == b"\xef\xbb\xbf":
        offset = 3

    # Skip leading whitespace (space, tab, newline, carriage return)
    while offset < len(data):
        byte = data[offset]
        # 0x20 = space, 0x09 = tab, 0x0A = newline, 0x0D = carriage return
        if byte in (0x20, 0x09, 0x0A, 0x0D):
            offset += 1
        else:
            break

    # Check if we found '<' after skipping whitespace
    if offset < len(data) and data[offset] == ord("<"):
        return None

    # No valid magic number found
    supported = "PNG, JPEG, GIF, WebP, SVG, AVIF, HEIF, HEIC, TIFF, or BMP"
    return f"File is not a valid image format (expected {supported})"
