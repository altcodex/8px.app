import type { categories as jaCategories } from '../ja/categories'
import type { SameStructure } from '../type-utils'

export const categories: SameStructure<typeof jaCategories> = {
  toys: 'Toys',
  tools: 'Tools',
} as const
