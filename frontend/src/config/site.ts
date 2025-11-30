/**
 * Site configuration based on environment variables
 * Text content (name, author) is managed in i18n messages
 */
export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://8px.app',
  links: {
    github: process.env.NEXT_PUBLIC_GITHUB_URL || '',
    sponsor: process.env.NEXT_PUBLIC_SPONSOR_URL || '',
    portfolio: process.env.NEXT_PUBLIC_PORTFOLIO_URL || ''
  }
} as const

export type SiteConfig = typeof siteConfig
