import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { privacyPolicy } from '@/config/privacy'

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  alternates: {
    canonical: '/privacy'
  }
}

export default function PrivacyLayout ({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return children
}
