import type { ReactNode } from 'react'

import {
  I18nLink,
  I18nProvider as BaseProvider,
  useLocale,
  useLocales,
  useLocalizedPath,
  useMessages as baseUseMessages,
  useTranslations as baseUseTranslations
} from './components'

export interface I18nConfig<
  L extends readonly string[] = readonly string[],
  M = any
> {
  locales: L
  defaultLocale: L[number]
  messages: Record<L[number], M>
}

/**
 * Create i18n instance with server and client APIs
 * This is a pure function that creates a self-contained i18n runtime
 *
 * @example
 * import { createI18n } from '@8pxapp/i18n'
 * import jaMessages from './messages/ja'
 * import enMessages from './messages/en'
 *
 * export const i18n = createI18n({
 *   locales: ['ja', 'en'] as const,
 *   defaultLocale: 'ja',
 *   messages: { ja: jaMessages, en: enMessages }
 * })
 *
 * // Server Component
 * const messages = await i18n.server.getMessages(locale)
 *
 * // Layout
 * <i18n.client.Provider locale={locale} messages={messages}>
 *   {children}
 * </i18n.client.Provider>
 */
export function createI18n<
  L extends readonly string[],
  M = any
> (config: I18nConfig<L, M>) {
  const { locales, defaultLocale, messages } = config

  // Server API
  const server = {
    /**
     * Get messages object for server components
     */
    getMessages: async <T = M>(locale: string): Promise<T> => {
      const moduleObj = messages[locale as L[number]]
      // Convert ES module namespace to plain object (required for Client Components)
      return JSON.parse(JSON.stringify(moduleObj)) as T
    },

    /**
     * Get translation function for server components
     */
    getTranslations: async <K extends string = string>(
      locale: string,
      namespace?: string
    ): Promise<(key: K) => string> => {
      const moduleObj = messages[locale as L[number]]
      const msgs = JSON.parse(JSON.stringify(moduleObj))

      return ((key: K) => {
        const fullKey = namespace ? `${String(namespace)}.${key}` : key
        const keys = fullKey.split('.')
        let obj: any = msgs

        for (const k of keys) {
          obj = obj?.[k]
          if (obj === undefined) {
            if (process.env.NODE_ENV === 'development') {
              console.warn(`[i18n] Missing key: "${fullKey}" in locale "${locale}"`)
            }
            return fullKey
          }
        }

        return obj
      }) as (key: K) => string
    },

    /**
     * Get locale from params (Next.js App Router)
     */
    getLocale: (params: { locale: string }): string => {
      return params.locale
    },

    /**
     * Generate localized path for a specific locale
     */
    getLocalizedPath: (path: string, locale: string): string => {
      if (locale === defaultLocale) {
        return path
      }
      return `/${locale}${path}`
    },

    /**
     * Get all available locales
     */
    getLocales: (): readonly string[] => {
      return locales
    },

    /**
     * Get default locale
     */
    getDefaultLocale: (): string => {
      return defaultLocale
    }
  }

  // Provider wrapper that only requires locale and messages
  function Provider ({ locale, messages, children }: {
    locale: string
    messages: any
    children: ReactNode
  }) {
    return (
      <BaseProvider
        locale={locale}
        messages={messages}
        defaultLocale={defaultLocale}
        locales={locales}
      >
        {children}
      </BaseProvider>
    )
  }

  // Type-safe wrappers for client hooks
  function useMessages<T = M> (): T {
    return baseUseMessages<T>()
  }

  function useTranslations<K extends string = string> (namespace?: string): (key: K) => string {
    return baseUseTranslations<K>(namespace)
  }

  // Client API
  const client = {
    Provider,
    useMessages,
    useTranslations,
    useLocale,
    useLocalizedPath,
    useLocales,
    Link: I18nLink
  }

  return {
    server,
    client
  }
}
