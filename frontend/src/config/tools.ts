// カテゴリ定義の型
type CategoryDefinition = {
  readonly id: string
  readonly name: string
}

// カテゴリ定義
const categoryDefinitions = [
  { id: 'color', name: 'Color' },
  { id: 'image', name: 'Image' }
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
    id: 'color-palette',
    name: 'カラーパレットジェネレーター',
    description: '知覚的な明度制御を用いてカラーパレットを作成・調整します。',
    shortDescription: 'カラーパレットを作成・調整',
    category: 'color',
    href: '/color-palette'
  },
  {
    id: 'image-to-palette',
    name: '画像カラーパレット',
    description: '画像から配色を抽出します。',
    shortDescription: '画像から配色を抽出',
    category: 'color',
    href: '/image-to-palette'
  },
  {
    id: 'favicon-generator',
    name: 'Faviconジェネレーター',
    description: '画像からfaviconファイルを生成します。Apple Touch IconやAndroidアイコンもサポート。すべての処理はブラウザで安全に行われます。',
    shortDescription: '画像からfaviconファイルを生成',
    category: 'image',
    href: '/favicon-generator'
  },
  {
    id: 'svg-optimizer',
    name: 'SVG圧縮ツール',
    description: 'SVGファイルを最適化・圧縮して、ファイルサイズを削減します。',
    shortDescription: 'SVGファイルを最適化・圧縮',
    category: 'image',
    href: '/svg-optimizer'
  },
  {
    id: 'image-corner-rounder',
    name: '画像角丸ツール',
    description: '画像の角をカスタマイズ可能な半径で丸くします。',
    shortDescription: '画像の角を丸くする',
    category: 'image',
    href: '/image-corner-rounder'
  },
  {
    id: 'image-converter',
    name: '画像変換ツール',
    description: '画像を異なるフォーマットに変換します。JPEG、PNG、WEBPなどをサポート。',
    shortDescription: '画像フォーマットを変換',
    category: 'image',
    href: '/image-converter'
  },
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
