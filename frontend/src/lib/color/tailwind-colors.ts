/**
 * Tailwind CSS v3 Color Palette
 * Imports colors from tailwindcss package to avoid hardcoding
 */

import * as colors from 'tailwindcss/colors'

export type TailwindShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950

export type TailwindColorName =
  | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
  | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green'
  | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo'
  | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'

export type TailwindColorScale = Record<TailwindShade, string>

/**
 * Tailwind v3 color palette imported from tailwindcss package
 */
export const tailwindColors: Record<TailwindColorName, TailwindColorScale> = {
  slate: colors.slate as TailwindColorScale,
  gray: colors.gray as TailwindColorScale,
  zinc: colors.zinc as TailwindColorScale,
  neutral: colors.neutral as TailwindColorScale,
  stone: colors.stone as TailwindColorScale,
  red: colors.red as TailwindColorScale,
  orange: colors.orange as TailwindColorScale,
  amber: colors.amber as TailwindColorScale,
  yellow: colors.yellow as TailwindColorScale,
  lime: colors.lime as TailwindColorScale,
  green: colors.green as TailwindColorScale,
  emerald: colors.emerald as TailwindColorScale,
  teal: colors.teal as TailwindColorScale,
  cyan: colors.cyan as TailwindColorScale,
  sky: colors.sky as TailwindColorScale,
  blue: colors.blue as TailwindColorScale,
  indigo: colors.indigo as TailwindColorScale,
  violet: colors.violet as TailwindColorScale,
  purple: colors.purple as TailwindColorScale,
  fuchsia: colors.fuchsia as TailwindColorScale,
  pink: colors.pink as TailwindColorScale,
  rose: colors.rose as TailwindColorScale
}

/**
 * Get all color names
 */
export function getColorNames (): TailwindColorName[] {
  return Object.keys(tailwindColors) as TailwindColorName[]
}

/**
 * Get all shade levels
 */
export function getShades (): TailwindShade[] {
  return [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
}

/**
 * Check if a color name is a gray scale
 */
export function isGrayScale (name: TailwindColorName): boolean {
  return ['slate', 'gray', 'zinc', 'neutral', 'stone'].includes(name)
}
