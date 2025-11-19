import { ColorHistoryFAB } from '@/components/color-history-fab'
import { ColorHistoryProvider } from '@/contexts/color-history-context'

export default function ColorToolsLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ColorHistoryProvider>
      {children}
      <ColorHistoryFAB />
    </ColorHistoryProvider>
  )
}
