import type { Config } from 'svgo/browser'
import { optimize } from 'svgo/browser'

/**
 * SVGO plugin options
 */
export type SvgoOptions = {
  // Numeric options
  floatPrecision: number
  transformPrecision: number

  // Plugin toggles
  removeDoctype: boolean
  removeComments: boolean
  removeMetadata: boolean
  removeTitle: boolean
  removeDesc: boolean
  removeUselessDefs: boolean
  removeEditorsNSData: boolean
  removeEmptyAttrs: boolean
  removeHiddenElems: boolean
  removeEmptyText: boolean
  removeEmptyContainers: boolean
  removeViewBox: boolean
  cleanupEnableBackground: boolean
  minifyStyles: boolean
  convertStyleToAttrs: boolean
  convertColors: boolean
  convertPathData: boolean
  convertTransform: boolean
  removeUnknownsAndDefaults: boolean
  removeNonInheritableGroupAttrs: boolean
  removeUselessStrokeAndFill: boolean
  removeUnusedNS: boolean
  cleanupIds: boolean
  cleanupNumericValues: boolean
  cleanupListOfValues: boolean
  moveElemsAttrsToGroup: boolean
  moveGroupAttrsToElems: boolean
  collapseGroups: boolean
  removeRasterImages: boolean
  mergePaths: boolean
  convertShapeToPath: boolean
  sortAttrs: boolean
  removeDimensions: boolean
  removeStyleElement: boolean
  removeScriptElement: boolean
}

/**
 * Preset configurations
 */
export const PRESET_SAFE: SvgoOptions = {
  // Numeric values
  floatPrecision: 3,
  transformPrecision: 5,

  // Plugins (safe defaults)
  removeDoctype: true,
  removeComments: true,
  removeMetadata: true,
  removeTitle: false, // Keep title for accessibility
  removeDesc: false, // Keep description for accessibility
  removeUselessDefs: true,
  removeEditorsNSData: true,
  removeEmptyAttrs: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  removeEmptyContainers: true,
  removeViewBox: false, // Keep viewBox for responsive SVGs
  cleanupEnableBackground: true,
  minifyStyles: true,
  convertStyleToAttrs: true,
  convertColors: true,
  convertPathData: true,
  convertTransform: true,
  removeUnknownsAndDefaults: true,
  removeNonInheritableGroupAttrs: true,
  removeUselessStrokeAndFill: true,
  removeUnusedNS: true,
  cleanupIds: true,
  cleanupNumericValues: true,
  cleanupListOfValues: true,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  collapseGroups: true,
  removeRasterImages: false,
  mergePaths: true,
  convertShapeToPath: true,
  sortAttrs: false,
  removeDimensions: false,
  removeStyleElement: false,
  removeScriptElement: false
}

export const PRESET_SVGO_DEFAULT: SvgoOptions = {
  // Numeric values
  floatPrecision: 3,
  transformPrecision: 5,

  // SVGO's actual default preset
  removeDoctype: true,
  removeComments: true,
  removeMetadata: true,
  removeTitle: true, // SVGO removes by default
  removeDesc: true, // SVGO removes by default
  removeUselessDefs: true,
  removeEditorsNSData: true,
  removeEmptyAttrs: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  removeEmptyContainers: true,
  removeViewBox: true, // SVGO removes by default
  cleanupEnableBackground: true,
  minifyStyles: true,
  convertStyleToAttrs: true,
  convertColors: true,
  convertPathData: true,
  convertTransform: true,
  removeUnknownsAndDefaults: true,
  removeNonInheritableGroupAttrs: true,
  removeUselessStrokeAndFill: true,
  removeUnusedNS: true,
  cleanupIds: true,
  cleanupNumericValues: true,
  cleanupListOfValues: true,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  collapseGroups: true,
  removeRasterImages: false,
  mergePaths: true,
  convertShapeToPath: true,
  sortAttrs: false,
  removeDimensions: false,
  removeStyleElement: false,
  removeScriptElement: false
}

export const PRESET_MAXIMUM: SvgoOptions = {
  // Numeric values (lower precision = smaller file)
  floatPrecision: 1,
  transformPrecision: 3,

  // Maximum compression - enable everything
  removeDoctype: true,
  removeComments: true,
  removeMetadata: true,
  removeTitle: true,
  removeDesc: true,
  removeUselessDefs: true,
  removeEditorsNSData: true,
  removeEmptyAttrs: true,
  removeHiddenElems: true,
  removeEmptyText: true,
  removeEmptyContainers: true,
  removeViewBox: true,
  cleanupEnableBackground: true,
  minifyStyles: true,
  convertStyleToAttrs: true,
  convertColors: true,
  convertPathData: true,
  convertTransform: true,
  removeUnknownsAndDefaults: true,
  removeNonInheritableGroupAttrs: true,
  removeUselessStrokeAndFill: true,
  removeUnusedNS: true,
  cleanupIds: true,
  cleanupNumericValues: true,
  cleanupListOfValues: true,
  moveElemsAttrsToGroup: true,
  moveGroupAttrsToElems: true,
  collapseGroups: true,
  removeRasterImages: true, // Remove embedded images
  mergePaths: true,
  convertShapeToPath: true,
  sortAttrs: true,
  removeDimensions: true, // Remove width/height
  removeStyleElement: true, // Remove style elements
  removeScriptElement: true // Remove scripts
}

export const DEFAULT_SVGO_OPTIONS = PRESET_SAFE

export type PresetId = 'safe' | 'svgo-default' | 'maximum'

export const PRESETS = [
  {
    id: 'safe' as const,
    label: '推奨',
    options: PRESET_SAFE
  },
  {
    id: 'svgo-default' as const,
    label: '標準圧縮',
    options: PRESET_SVGO_DEFAULT
  },
  {
    id: 'maximum' as const,
    label: '最大圧縮',
    options: PRESET_MAXIMUM
  }
] as const

/**
 * Convert our custom options format to SVGO config
 */
export function buildSvgoConfig (options: SvgoOptions): Config {
  // Build plugins array with overrides
  const plugins: any[] = [
    // Start with preset-default but customize specific plugins
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Numeric precision overrides
          cleanupNumericValues: {
            floatPrecision: options.floatPrecision
          },
          convertTransform: {
            floatPrecision: options.transformPrecision
          },
          // Boolean plugin overrides (false = disable, true = use default params)
          removeDoctype: options.removeDoctype,
          removeComments: options.removeComments,
          removeMetadata: options.removeMetadata,
          removeTitle: options.removeTitle,
          removeDesc: options.removeDesc,
          removeUselessDefs: options.removeUselessDefs,
          removeEditorsNSData: options.removeEditorsNSData,
          removeEmptyAttrs: options.removeEmptyAttrs,
          removeHiddenElems: options.removeHiddenElems,
          removeEmptyText: options.removeEmptyText,
          removeEmptyContainers: options.removeEmptyContainers,
          removeViewBox: options.removeViewBox,
          cleanupEnableBackground: options.cleanupEnableBackground,
          minifyStyles: options.minifyStyles,
          convertStyleToAttrs: options.convertStyleToAttrs,
          convertColors: options.convertColors,
          convertPathData: options.convertPathData,
          removeUnknownsAndDefaults: options.removeUnknownsAndDefaults,
          removeNonInheritableGroupAttrs: options.removeNonInheritableGroupAttrs,
          removeUselessStrokeAndFill: options.removeUselessStrokeAndFill,
          removeUnusedNS: options.removeUnusedNS,
          cleanupIds: options.cleanupIds,
          cleanupListOfValues: options.cleanupListOfValues,
          moveElemsAttrsToGroup: options.moveElemsAttrsToGroup,
          moveGroupAttrsToElems: options.moveGroupAttrsToElems,
          collapseGroups: options.collapseGroups,
          removeRasterImages: options.removeRasterImages,
          mergePaths: options.mergePaths,
          convertShapeToPath: options.convertShapeToPath,
          sortAttrs: options.sortAttrs,
          removeDimensions: options.removeDimensions,
          removeStyleElement: options.removeStyleElement,
          removeScriptElement: options.removeScriptElement
        }
      }
    }
  ]

  return {
    plugins,
    multipass: true
  }
}

/**
 * Optimize SVG using SVGO with the given options
 */
export function optimizeSvg (svgString: string, options: SvgoOptions): string {
  const config = buildSvgoConfig(options)

  try {
    const result = optimize(svgString, config)
    return result.data
  } catch (error) {
    console.error('SVGO optimization failed:', error)
    throw new Error('SVGの最適化に失敗しました')
  }
}
