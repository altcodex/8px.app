import { SupportSection } from '@/components/layout/support-section'

import { IromideClient } from './_components/iromide-client'

export default async function IromidePage ({ params }: { params: Promise<{ locale: string }> }) {
  return (
    <IromideClient
      supportSection={<SupportSection />}
    />
  )
}
