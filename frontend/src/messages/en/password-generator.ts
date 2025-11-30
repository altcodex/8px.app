import type { passwordGenerator as jaPasswordGenerator } from '../ja/password-generator'
import type { SameStructure } from '../type-utils'

export const passwordGenerator: SameStructure<typeof jaPasswordGenerator> = {
  selectCharacterTypes: 'Select Character Types',
  copyToClipboard: 'Copy Password to Clipboard',
  length: 'Length',
  characterTypes: 'Character Types',
  characterTypesHint: 'Selected character types will each include at least one character.',
  uppercase: 'Uppercase',
  lowercase: 'Lowercase',
  numbers: 'Numbers',
  symbols: 'Symbols',
  avoidAmbiguous: 'Exclude Ambiguous Characters',
  avoidAmbiguousHint: 'e.g., 0 and O, 1 and l and I',
  errors: {
    copyFailed: 'Failed to copy.',
  },
} as const
