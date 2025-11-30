import type { common as jaCommon } from '../ja/common'
import type { SameStructure } from '../type-utils'

export const common: SameStructure<typeof jaCommon> = {
  home: 'Home',
  selectImage: 'Select an Image',
  download: 'Download',
  copy: 'Copy',
  copied: 'Copied!',
  regenerate: 'Regenerate',
  reset: 'Reset',
  preview: 'Preview',
  processing: 'Processing...',
  analyzing: 'Analyzing...',
  privacyNotice: 'Images are processed securely in your browser and never sent to our servers.',
  dragDropAnywhere: 'Or drag and drop anywhere on the screen.',
  imageProcessingOnlyNotice: 'Your images are processed for transformation only and are not stored.',
  unsupportedFileType: 'Unsupported file type.',
  fileValidationError: 'File validation failed.',
  dropToUpload: 'Drop to upload your image.',
  networkError: 'A network error occurred. Please wait a moment and try again.',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  error: 'Something went wrong',
} as const
