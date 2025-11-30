import type { StaticImageData } from 'next/image'

import faviconGeneratorIcon from '@/assets/icons/favicon-generator.svg'
import iromideIcon from '@/assets/icons/iromide.svg'
import passwordGeneratorIcon from '@/assets/icons/password-generator.svg'
import svgOptimizerIcon from '@/assets/icons/svg-optimizer.svg'
import twPaletteGeneratorIcon from '@/assets/icons/tw-palette-generator.svg'

// Category definition type
type CategoryDefinition = {
  readonly id: string
  readonly iconBgColor: string
}

// Category definitions
const categoryDefinitions = [
  { id: 'toys', iconBgColor: 'bg-logo-accent/70' },
  { id: 'tools', iconBgColor: 'bg-logo-medium/70' }
] as const satisfies readonly CategoryDefinition[]

// Auto-extract category ID type
export type CategoryId = typeof categoryDefinitions[number]['id']

// Tool IDs that match translation keys
export type ToolId = [
  'tw-palette-generator',
  'iromide',
  'favicon-generator',
  'svg-optimizer',
  'password-generator'
][number]

export type Tool = {
  id: ToolId
  icon: StaticImageData
  category: CategoryId
}

export type Category = {
  id: CategoryId
  iconBgColor: string
  tools: Tool[]
}

export const tools: Tool[] = [
  { id: 'tw-palette-generator', icon: twPaletteGeneratorIcon, category: 'tools' },
  { id: 'iromide', icon: iromideIcon, category: 'toys' },
  { id: 'favicon-generator', icon: faviconGeneratorIcon, category: 'tools' },
  { id: 'svg-optimizer', icon: svgOptimizerIcon, category: 'tools' },
  { id: 'password-generator', icon: passwordGeneratorIcon, category: 'tools' }
]

// Auto-generate category list
export const categories: Category[] = categoryDefinitions.map(cat => ({
  id: cat.id,
  iconBgColor: cat.iconBgColor,
  tools: tools.filter(tool => tool.category === cat.id)
}))
