import type { StaticImageData } from 'next/image'

import faviconGeneratorIcon from '@/assets/icons/favicon-generator.svg'
import iromideIcon from '@/assets/icons/iromide.svg'
import passwordGeneratorIcon from '@/assets/icons/password-generator.svg'
import svgOptimizerIcon from '@/assets/icons/svg-optimizer.svg'
import twPaletteGeneratorIcon from '@/assets/icons/tw-palette-generator.svg'

// Category definition type
type CategoryDefinition = {
  readonly id: string
  readonly name: string
  readonly iconBgColor: string
}

// Category definitions
const categoryDefinitions = [
  { id: 'toys', name: 'Toys', iconBgColor: 'bg-logo-accent/70' },
  { id: 'tools', name: 'Tools', iconBgColor: 'bg-logo-medium/70' }
] as const satisfies readonly CategoryDefinition[]

// Auto-extract category ID type
export type CategoryId = typeof categoryDefinitions[number]['id']

export type Tool = {
  id: string
  name: string
  description: string
  shortDescription?: string // For popovers and compact displays
  icon: StaticImageData // Imported icon with hash
  category: CategoryId
}

export type Category = {
  id: CategoryId
  name: string
  iconBgColor: string
  tools: Tool[]
}

// https://api.dicebear.com/9.x/shapes/svg?backgroundColor=transparent&seed=
export const tools: Tool[] = [
  {
    id: 'tw-palette-generator',
    name: 'TWパレットジェネレーター',
    description: `指定した色から、TailwindCSSに最適化されたカラーパレットを自動生成。
コーポレートカラーやブランドカラーをベースに、50〜950まで統一感のある配色を無料で作成できます。`,
    shortDescription: '選んだ色からカラーパレットを生成',
    icon: twPaletteGeneratorIcon,
    category: 'tools'
  },
  {
    id: 'iromide',
    name: '推し色生成 イロマイド',
    description: `写真から推し色のカラーパレットを生成する無料ツール。
人間の知覚に近い画像解析で、あなたの「推し色」を抽出。
チェキ風デザインでSNSシェアも簡単です。`,
    shortDescription: '写真から推し色チェキを作ろう！',
    icon: iromideIcon,
    category: 'toys',
  },
  {
    id: 'favicon-generator',
    name: 'Faviconジェネレーター',
    description: `無料のFavicon一括生成ツール。PNG、JPEG、SVGなどの画像をアップロードするだけで、Webサイトに必要な全サイズのFaviconとApple Touch Iconを自動生成。
角丸加工や背景色の設定もブラウザ上で簡単に完了します。`,
    shortDescription: '画像からfaviconファイルを生成',
    icon: faviconGeneratorIcon,
    category: 'tools'
  },
  {
    id: 'svg-optimizer',
    name: 'SVG最適化',
    description: `無料のSVG最適化・圧縮ツール。品質を保ったままファイルサイズを削減し、Webサイトの読み込み速度を改善。
ブラウザ上で完結するため、セキュアで高速に最適化できます。`,
    shortDescription: 'SVGファイルを最適化・圧縮',
    icon: svgOptimizerIcon,
    category: 'tools'
  },
  {
    id: 'password-generator',
    name: 'パスワードジェネレーター',
    description: `無料の強力なパスワード生成ツール。文字数、大文字・小文字・数字・記号を自由に組み合わせて、セキュアなパスワードを作成。
紛らわしい文字の除外にも対応し、ブラウザ完結で安全です。`,
    shortDescription: 'シンプルなパスワードジェネレーター',
    icon: passwordGeneratorIcon,
    category: 'tools'
  }
]

// Auto-generate category list
export const categories: Category[] = categoryDefinitions.map(cat => ({
  id: cat.id,
  name: cat.name,
  iconBgColor: cat.iconBgColor,
  tools: tools.filter(tool => tool.category === cat.id)
}))
