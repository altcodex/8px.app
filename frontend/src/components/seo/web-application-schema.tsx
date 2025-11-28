import { siteConfig } from '@/config/site'
import type { Tool } from '@/config/tools'

interface WebApplicationSchemaProps {
  tool: Tool
}

export function WebApplicationSchema ({ tool }: WebApplicationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description.replace(/\r?\n/g, ' '),
    url: `${siteConfig.url}/${tool.id}`,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'JPY'
    },
    author: {
      '@type': 'Person',
      name: siteConfig.author
    }
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
