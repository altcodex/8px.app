import type { faviconGenerator as jaFaviconGenerator } from '../ja/favicon-generator'
import type { SameStructure } from '../type-utils'

export const faviconGenerator: SameStructure<typeof jaFaviconGenerator> = {
  outputOptions: 'Output Options',
  uploadHint: 'Upload PNG, JPG, WEBP, SVG, or other image files (max 10MB).',
  previewPlaceholder: {
    line1: 'Select an image to',
    line2: 'see a preview.',
  },
  fileFormat: 'Output File Format',
  formatDescriptions: {
    favicon: 'For traditional browsers.',
    'apple-touch-icon': 'For iOS (180x180 px).',
    'android-icon': 'For Android/PWAs (192x192, 512x512 px).',
  },
  faviconSizes: 'Sizes to include in favicon.ico',
  recommendedSizes: 'Recommended Sizes',
  otherSizes: 'Other Sizes',
  borderRadius: 'Adjust Corner Radius',
  borderRadiusHint:
    'Rounds the corners of your icon. iOS automatically applies rounded corners to Apple Touch Icons.',
  backgroundColorSetting: 'Background Color Settings',
  backgroundColorHint:
    'Adds a background color to transparent PNGs. A background color is always applied to Apple Touch Icons.',
  addBackgroundColor: 'Add Background Color',
  selectBackgroundColor: 'Select Background Color',
  backgroundColorCode: 'Background Color Code',
  toggleFormat: '{action} {format}',
  toggleSize: '{action} {size}×{size} pixels',
  select: 'Select',
  deselect: 'Deselect',
  errors: {
    imageLoadFailed: 'Failed to load image.',
    selectImage: 'Please select an image file.',
    selectOutputFormat: 'Please select at least one output format.',
    selectSize: 'If favicon.ico is selected, please choose at least one size.',
    generateFailed: 'Failed to generate favicon.',
  },
} as const
