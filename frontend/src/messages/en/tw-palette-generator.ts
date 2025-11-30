import type { twPaletteGenerator as jaTwPaletteGenerator } from '../ja/tw-palette-generator'
import type { SameStructure } from '../type-utils'

export const twPaletteGenerator: SameStructure<typeof jaTwPaletteGenerator> = {
  baseColorSelection: 'Base Color Selection',
  colorCode: 'Color Code',
  adjustment: 'Adjustments',
  hue: 'Hue',
  lightness: 'Lightness',
  saturation: 'Saturation',
  resetAdjustment: 'Reset Adjustments',
  generatedPalette: 'Generated Palette',
  saveToHistory: 'Save to History',
  paletteHistory: 'Palette History',
  deleteAllHistory: 'Delete All History',
  historyEmptyMessage: 'Your generated color palettes will appear here when saved.',
  tailwindConfig: 'Tailwind Config',
  copyConfig: 'Copy Tailwind Config',
  deleteFromHistory: 'Delete from History',
  errors: {
    colorCodeCopyFailed: 'Failed to copy color code.',
    colorCodeCopied: 'Color code copied!',
    configCopied: 'Tailwind config copied!',
    addedToHistory: 'Added to history.',
  },
} as const
