import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { siteConfig } from '@/config/site'
import { getToolById } from '@/config/tools'

const tool = getToolById('image-palette')

export const metadata: Metadata = tool
  ? {
      title: tool.name,
      description: tool.description,
      alternates: {
        canonical: `/${tool.id}`
      },
      openGraph: {
        type: 'website',
        url: `/${tool.id}`,
        title: `${tool.name} - ${siteConfig.name}`,
        description: tool.description,
        siteName: siteConfig.name
      },
      twitter: {
        card: 'summary',
        title: `${tool.name} - ${siteConfig.name}`,
        description: tool.description
      }
    }
  : {}

export default function ImagePaletteLayout ({ children }: { children: ReactNode }) {
  return <>{children}</>
}
