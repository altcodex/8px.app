// i18n.ts
import { define } from 'next-i18n-tiny'

import enMessages from '@/messages/en'
import jaMessages from '@/messages/ja'

export type Locale = 'ja' | 'en'
export const locales: Locale[] = ['ja', 'en']
export const defaultLocale: Locale = 'ja'

const { client, server, Link, Provider } = define({
  locales,
  defaultLocale,
  messages: { ja: jaMessages, en: enMessages }
})

export { Link, Provider }
export const { useMessages, useTranslations, useLocale } = client
export const { getMessages, getTranslations } = server

export function getLocalizedPath (path: string, locale: Locale): string {
  if (locale === defaultLocale) {
    return path
  }
  return `/${locale}${path}`
}
