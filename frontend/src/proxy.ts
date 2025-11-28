import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'

export default createMiddleware({
  ...routing,
  // Disable automatic locale detection
  // Reasons: SEO optimization, performance, consistency with Japan-focused promotion
  // - / is always Japanese (for domestic Japan promotion)
  // - /en is always English (for international SEO traffic)
  // - Language switching is handled via LocaleSwitcher in header
  localeDetection: false
})

export const config = {
  // Path patterns to apply next-intl middleware
  // Excludes static files, API routes, and Next.js internal files
  matcher: [
    '/',
    '/(ja|en)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)'
  ]
}
