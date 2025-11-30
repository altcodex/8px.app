import type { tools as jaTools } from '../ja/tools'
import type { SameStructure } from '../type-utils'

export const tools: SameStructure<typeof jaTools> = {
  'tw-palette-generator': {
    name: 'TW Palette Generator',
    description:
      'Generate a complete Tailwind CSS color palette from any base color. Easily create harmonious, production-ready color scales (50-950) that align perfectly with your brand, all for free.',
    shortDescription: 'Create Tailwind CSS color palettes from a single hue.',
  },
  iromide: {
    name: 'Iromide - Fave Color Generator',
    description:
      "Discover your favorite colors! Iromide is a free tool that extracts a palette of your most cherished hues from any photo using advanced perceptual image analysis. Share your unique 'polaroid-style' color memory easily on social media.",
    shortDescription: "Turn photos into 'fave color' polaroids!",
  },
  'favicon-generator': {
    name: 'Favicon Generator',
    description:
      'Instantly create all the favicons your website needs! This free tool generates multi-platform favicons and Apple Touch Icons from your PNG, JPEG, or SVG images. Easily customize rounded corners and background colors, all within your browser.',
    shortDescription: 'Turn any image into a complete favicon set.',
  },
  'svg-optimizer': {
    name: 'SVG Optimizer',
    description:
      "Boost your website's performance with our free SVG Optimizer. Reduce file sizes, maintain visual quality, and speed up load times. All optimizations are performed securely and rapidly directly in your browser.",
    shortDescription: 'Streamline and compress your SVG files.',
  },
  'password-generator': {
    name: 'Password Generator',
    description:
      "Generate robust, secure passwords with our free online tool. Customize length, include/exclude uppercase, lowercase, numbers, and symbols. We even offer an option to avoid ambiguous characters (like '0' and 'O'). All generation happens securely in your browser.",
    shortDescription: 'Quick and secure password generation.',
  },
} as const
