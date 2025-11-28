export const siteConfig = {
  name: '8px.app',
  url: 'https://8px.app',
  author: 'unlibra',
  links: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
    sponsor: process.env.NEXT_PUBLIC_SPONSOR_URL || ''
  }
} as const

export type SiteConfig = typeof siteConfig
