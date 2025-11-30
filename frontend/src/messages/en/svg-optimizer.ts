import type { svgOptimizer as jaSvgOptimizer } from '../ja/svg-optimizer'
import type { SameStructure } from '../type-utils'

export const svgOptimizer: SameStructure<typeof jaSvgOptimizer> = {
  uploadHint: 'Upload SVG files (max 10MB).',
  previewPlaceholder: {
    line1: 'Select an SVG file to',
    line2: 'see a preview.',
  },
  original: 'Original',
  optimized: 'Optimized',
  compressionRatio: 'Compression Ratio',
  preset: 'Preset',
  safe: 'Recommended',
  'svgo-default': 'Standard Compression',
  maximum: 'Maximum Compression',
  custom: 'Custom',
  selectPreset: 'Select {preset}',
  precisionSettings: 'Precision Settings',
  precisionHint:
    'Adjust the numeric precision. Lower values increase compression but reduce accuracy.',
  floatPrecision: 'Floating Point Precision',
  transformPrecision: 'Transform Attribute Precision',
  options: 'Optimization Options',
  groups: {
    cleanup: 'Cleanup',
    optimization: 'Optimization',
    structural: 'Structural Changes',
    advanced: 'Advanced Settings',
    dangerous: 'Dangerous Settings',
    dangerousDescription: 'Security risks are present. Only use with trusted SVG files.',
  },
  errors: {
    svgLoadFailed: 'Failed to load SVG file.',
    selectSvg: 'Please select an SVG file.',
    optimizeFailed: 'Failed to optimize SVG.',
  },
} as const
