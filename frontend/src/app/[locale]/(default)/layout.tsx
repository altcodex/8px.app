import type { ReactNode } from 'react'

import { SupportSection } from '@/components/layout/support-section'
import type { Locale } from '@/lib/i18n/types'

export default async function WithSupportLayout ({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <>
      {children}
      <SupportSection locale={locale as Locale} />
    </>
  )
}
