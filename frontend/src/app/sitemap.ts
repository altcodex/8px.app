import type { MetadataRoute } from 'next'

import { siteConfig } from '@/config/site'
import { categories } from '@/config/tools'

export const dynamic = 'force-static'

export default function sitemap (): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // ホームページ
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl
    }
  ]

  // 全ツールページを追加
  for (const category of categories) {
    for (const tool of category.tools) {
      routes.push({
        url: `${baseUrl}/${tool.id}`
      })
    }
  }

  return routes
}
