// カテゴリ定義の型
type CategoryDefinition = {
  readonly id: string
  readonly name: string
}

// カテゴリ定義
const categoryDefinitions = [
  { id: 'image', name: 'Image' },
  { id: 'color', name: 'Color' }
] as const satisfies readonly CategoryDefinition[]

// カテゴリIDの型を自動抽出
export type CategoryId = typeof categoryDefinitions[number]['id']

export type Tool = {
  id: string
  name: string
  description: string
  shortDescription?: string // For popovers and compact displays
  category: CategoryId
  href: string
}

export type Category = {
  id: CategoryId
  name: string
  tools: Tool[]
}

// Mock data - 実際のツール実装時に更新
export const tools: Tool[] = [
  {
    id: 'favicon-generator',
    name: 'Faviconジェネレーター',
    description: '画像からfaviconファイルを生成します。Apple Touch IconやAndroidアイコンもサポート。すべての処理はブラウザで安全に行われます。',
    shortDescription: '画像からfaviconファイルを生成',
    category: 'image',
    href: '/favicon-generator'
  },
  {
    id: 'image-corner-rounder',
    name: 'Image Corner Rounder',
    description: 'Round the corners of your images with customizable radius.',
    shortDescription: '画像の角を丸くする',
    category: 'image',
    href: '/image-corner-rounder'
  },
  {
    id: 'avatar-generator',
    name: 'Avatar Generator',
    description: 'Generate geometric avatars from seed values. Deterministic and unique.',
    shortDescription: '幾何学的なアバターを生成',
    category: 'image',
    href: '/avatar-generator'
  },
  {
    id: 'svg-optimizer',
    name: 'SVG Optimizer',
    description: 'Optimize and minify SVG files to reduce file size.',
    shortDescription: 'SVGファイルを最適化・圧縮',
    category: 'image',
    href: '/svg-optimizer'
  },
  {
    id: 'color-palette',
    name: 'Color Palette Tool',
    description: 'Create and adjust color palettes with perceptual lightness control.',
    shortDescription: 'カラーパレットを作成・調整',
    category: 'color',
    href: '/color-palette'
  },
  {
    id: 'image-to-palette',
    name: 'Image to Palette',
    description: 'Extract color palettes from images using k-means++ clustering.',
    shortDescription: '画像から配色を抽出',
    category: 'color',
    href: '/image-to-palette'
  },
  {
    id: 'accessibility-checker',
    name: 'Accessibility Checker',
    description: 'Check color contrast and accessibility of your designs.',
    shortDescription: '色のコントラストをチェック',
    category: 'color',
    href: '/accessibility-checker'
  }
]

// カテゴリ一覧を自動生成
export const categories: Category[] = categoryDefinitions.map(cat => ({
  id: cat.id,
  name: cat.name,
  tools: tools.filter(tool => tool.category === cat.id)
}))

// ヘルパー関数
export function getToolById (id: string): Tool | undefined {
  return tools.find(t => t.id === id)
}
