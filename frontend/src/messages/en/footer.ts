import type { footer as jaFooter } from '../ja/footer'
import type { SameStructure } from '../type-utils'

export const footer: SameStructure<typeof jaFooter> = {
  support: 'Support',
  bugReport: 'Report a Bug',
  contact: 'Contact Us',
  donate: 'Donate & Support',
  privacyPolicy: 'Privacy Policy',
  github: 'GitHub',
} as const
