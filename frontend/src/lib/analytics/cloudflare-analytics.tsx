'use client'

import Script from 'next/script'

/**
 * Cloudflare Web Analytics component
 * Requires NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN environment variable
 */
export function CloudflareAnalytics () {
  const token = process.env.NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN

  if (!token) {
    return null
  }

  return (
    <Script
      defer
      src='https://static.cloudflareinsights.com/beacon.min.js'
      data-cf-beacon={`{"token": "${token}"}`}
      strategy='afterInteractive'
    />
  )
}
