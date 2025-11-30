import type { aria as jaAria } from '../ja/aria'
import type { SameStructure } from '../type-utils'

export const aria: SameStructure<typeof jaAria> = {
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  toggleTheme: 'Toggle theme',
} as const
