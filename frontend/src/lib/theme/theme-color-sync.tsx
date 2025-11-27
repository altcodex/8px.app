'use client'

import { useTheme } from 'next-themes'
import { useEffect } from 'react'

/**
 * Synchronizes the theme-color meta tag with the current theme
 * This ensures iOS overscroll areas match the current theme
 */
export function ThemeColorSync () {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', resolvedTheme === 'dark' ? '#282c34' : '#ffffff')
    }
  }, [resolvedTheme])

  return null
}
