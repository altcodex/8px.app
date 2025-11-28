import type { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site'
import { categories } from '@/config/tools'
import { defaultLocale, locales } from '@/i18n/request'

export const dynamic = 'force-static'

export default function sitemap (): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url
  const routes: MetadataRoute.Sitemap = []

  // Generate URLs for each locale
  for (const locale of locales) {
    const localePrefix = locale === defaultLocale ? '' : `/${locale}`

    // Homepage
    routes.push({
      url: `${baseUrl}${localePrefix}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [
            l,
            `${baseUrl}${l === defaultLocale ? '' : `/${l}`}`
          ])
        )
      }
    })

    // Add all tool pages
    for (const category of categories) {
      for (const tool of category.tools) {
        routes.push({
          url: `${baseUrl}${localePrefix}/${tool.id}`,
          alternates: {
            languages: Object.fromEntries(
              locales.map(l => [
                l,
                `${baseUrl}${l === defaultLocale ? '' : `/${l}`}/${tool.id}`
              ])
            )
          }
        })
      }
    }

    // Add privacy policy page
    routes.push({
      url: `${baseUrl}${localePrefix}/privacy`,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [
            l,
            `${baseUrl}${l === defaultLocale ? '' : `/${l}`}/privacy`
          ])
        )
      }
    })
  }

  return routes
}
