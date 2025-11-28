import { getRequestConfig } from 'next-intl/server'

// サポートするロケール
export const locales = ['ja', 'en'] as const
export type Locale = typeof locales[number]

// デフォルトロケール
export const defaultLocale: Locale = 'ja'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // ロケールの検証
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
