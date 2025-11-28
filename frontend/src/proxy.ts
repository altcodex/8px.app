import createMiddleware from 'next-intl/middleware'

import { defaultLocale, locales } from './i18n/request'

export default createMiddleware({
  // サポートするロケール
  locales,

  // デフォルトロケール
  defaultLocale,

  // デフォルトロケールをパスに含めるかどうか
  // falseの場合、/ja/page ではなく /page でアクセス可能
  localePrefix: 'as-needed',

  // ブラウザの言語判定を無効化
  // 理由: SEO最適化、パフォーマンス向上、日本プロモーションとの整合性
  // - / は常に日本語（日本国内プロモーション用）
  // - /en は常に英語（海外SEO流入用）
  // - 言語切り替えはヘッダーのLocaleSwitcherで対応
  localeDetection: false
})

export const config = {
  // next-intlを適用するパスのパターン
  // 静的ファイル、API、Next.js内部ファイルを除外
  matcher: [
    '/',
    '/(ja|en)/:path*',
    '/((?!_next|_vercel|api|.*\\..*).*)'
  ]
}
