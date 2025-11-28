import { getRequestConfig } from 'next-intl/server'

import { routing } from './routing'

// Supported locales
export const locales = ['ja', 'en'] as const
export type Locale = typeof locales[number]

// Default locale
export const defaultLocale: Locale = 'ja'

export default getRequestConfig(async ({ locale }) => {
  // Validate locale
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
