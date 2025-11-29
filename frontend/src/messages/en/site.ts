import type { site as jaSite } from '../ja/site'
import type { SameStructure } from '../type-utils'

export const site: SameStructure<typeof jaSite> = {
  name: '8px.app',
  author: 'unlibra',
  description:
    'Craft your perfect colors and icons. 8px.app offers a free toolkit for web and app developers, including favicon generation, color palette creation, SVG optimization, and more. No account needed, start creating instantly.',
  heroDescription:
    'Your vision, your design. A comprehensive toolkit for web and app developers. Completely free, entirely open source.',
  title: {
    default: '8px.app - Developer Toolkit',
    template: '%s | 8px.app',
  },
} as const
