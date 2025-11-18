import type { Config } from 'svgo/browser'
import { optimize } from 'svgo/browser'

import type { SvgoOptions } from '@/app/(tools)/svg-optimizer/svgo-options'

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
