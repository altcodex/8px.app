import type { iromide as jaIromide } from '../ja/iromide'
import type { SameStructure } from '../type-utils'

export const iromide: SameStructure<typeof jaIromide> = {
  tryWithYourImage: 'Try with Your Own Image',
  recommendedAspectRatio: 'Recommended: Portrait (3:4) / Square (1:1) / Landscape (8:5).',
  addMessage: 'Add a Message (Optional)',
  sharing: 'Generating Share Image...',
  share: 'Share',
  tryAnotherImage: 'Try Another Image',
  errors: {
    colorExtractionFailed: 'Failed to extract colors.',
    shareTargetNotReady: 'Share image is not ready.',
    imageGenerationFailed: 'Failed to generate image.',
    shareFailed: 'Failed to share.',
    shareNotSupported:
      'Sharing is not supported in your browser. Please download the image instead.',
  },
  shareText: 'What are your cherished colors? Create a palette with Iromide!',
} as const
