/**
 * Next.js Proxy for i18n routing (Next.js 16+)
 *
 * Handles language detection and routing for all non-locale-prefixed paths:
 * - Japanese (Accept-Language: ja): Internal rewrite to /ja/* content
 * - Other languages: Redirect to /en/*
 */
import { NextResponse, type NextRequest } from 'next/server'

const locales = ['ja', 'en']
const defaultLocale = 'en'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path already has a locale prefix
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    return NextResponse.next()
  }

  // Language detection from Accept-Language header
  const acceptLang = request.headers.get('Accept-Language') ?? ''
  const primaryLang = acceptLang.split(',')[0]?.trim().toLowerCase() ?? ''
  const preferJa = primaryLang.startsWith('ja')

  const locale = preferJa ? 'ja' : defaultLocale

  if (preferJa) {
    // Japanese: Internal rewrite (URL stays the same, content from /ja/*)
    request.nextUrl.pathname = `/${locale}${pathname}`
    return NextResponse.rewrite(request.nextUrl)
  }

  // Other languages: Redirect to /en/*
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl, 302)
}

export const config = {
  // Match all paths except static files, api routes, and Next.js internals
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)+']
}
