'use client'

import { ThemeProvider } from 'next-themes'

import { ToastProvider } from '@/components/ui/toast'
import type { Locale, Messages } from '@/lib/i18n'
import { Provider as I18nProvider } from '@/lib/i18n'

export function Providers ({
  children,
  locale,
  messages
}: {
  children: React.ReactNode
  locale: Locale
  messages: Messages
}) {
  return (
    <I18nProvider locale={locale} messages={messages}>
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </I18nProvider>
  )
}
