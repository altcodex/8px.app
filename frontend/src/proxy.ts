import { create } from '@i18n-tiny/next/proxy'

import { defaultLocale, fallbackLocale, locales } from '@/lib/i18n'

export const proxy = create({
  locales,
  defaultLocale,
  fallbackLocale
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
