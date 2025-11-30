import type { supportSection as jaSupportSection } from '../ja/support-section'
import type { SameStructure } from '../type-utils'

export const supportSection: SameStructure<typeof jaSupportSection> = {
  shareOnX: 'Share on X',
  sendTip: 'Send a Tip',
  share: 'Share'
} as const
