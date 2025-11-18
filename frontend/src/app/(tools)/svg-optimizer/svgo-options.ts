// SVGO plugin options
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

// Preset configurations
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

// Plugin descriptions for UI
export const PLUGIN_DESCRIPTIONS: Record<keyof SvgoOptions, string> = {
  floatPrecision: '小数点以下の桁数',
  transformPrecision: 'transform属性の精度',
  removeDoctype: 'DOCTYPE宣言を削除',
  removeComments: 'コメントを削除',
  removeMetadata: 'メタデータを削除',
  removeTitle: 'title要素を削除',
  removeDesc: 'desc要素を削除',
  removeUselessDefs: '未使用のdefs要素を削除',
  removeEditorsNSData: 'エディタの名前空間データを削除',
  removeEmptyAttrs: '空の属性を削除',
  removeHiddenElems: '非表示要素を削除',
  removeEmptyText: '空のテキスト要素を削除',
  removeEmptyContainers: '空のコンテナを削除',
  removeViewBox: 'viewBox属性を削除',
  cleanupEnableBackground: 'enable-backgroundを最適化',
  minifyStyles: 'スタイルを圧縮',
  convertStyleToAttrs: 'スタイルを属性に変換',
  convertColors: '色を短縮形に変換',
  convertPathData: 'パスデータを最適化',
  convertTransform: 'transform属性を最適化',
  removeUnknownsAndDefaults: '不明な要素とデフォルト値を削除',
  removeNonInheritableGroupAttrs: '継承不可能なグループ属性を削除',
  removeUselessStrokeAndFill: '不要なstroke/fillを削除',
  removeUnusedNS: '未使用の名前空間を削除',
  cleanupIds: 'IDを最適化',
  cleanupNumericValues: '数値を最適化',
  cleanupListOfValues: '値のリストを最適化',
  moveElemsAttrsToGroup: '要素の属性をグループに移動',
  moveGroupAttrsToElems: 'グループの属性を要素に移動',
  collapseGroups: 'グループを折りたたみ',
  removeRasterImages: 'ラスター画像を削除',
  mergePaths: 'パスをマージ',
  convertShapeToPath: '図形をパスに変換',
  sortAttrs: '属性をソート',
  removeDimensions: 'width/height属性を削除',
  removeStyleElement: 'style要素を削除',
  removeScriptElement: 'script要素を削除'
}

// Plugin groups for organized UI
export const PLUGIN_GROUPS = [
  {
    id: 'cleanup',
    label: 'クリーンアップ',
    description: '不要な要素や属性を削除します。',
    plugins: [
      'removeDoctype',
      'removeComments',
      'removeMetadata',
      'removeEditorsNSData',
      'removeEmptyAttrs',
      'removeHiddenElems',
      'removeEmptyText',
      'removeEmptyContainers',
      'removeUselessDefs',
      'removeUnusedNS',
      'removeRasterImages',
      'removeScriptElement',
      'removeStyleElement'
    ] as Array<keyof SvgoOptions>
  },
  {
    id: 'optimization',
    label: '最適化',
    description: 'コードを最適化してファイルサイズを削減します。',
    plugins: [
      'cleanupIds',
      'cleanupNumericValues',
      'cleanupListOfValues',
      'cleanupEnableBackground',
      'minifyStyles',
      'convertStyleToAttrs',
      'convertColors',
      'convertPathData',
      'convertTransform',
      'removeUnknownsAndDefaults',
      'removeNonInheritableGroupAttrs',
      'removeUselessStrokeAndFill'
    ] as Array<keyof SvgoOptions>
  },
  {
    id: 'structural',
    label: '構造変更',
    description: 'SVGの構造を変更して最適化します。',
    plugins: [
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      'mergePaths',
      'convertShapeToPath',
      'sortAttrs'
    ] as Array<keyof SvgoOptions>
  },
  {
    id: 'advanced',
    label: '高度な設定',
    description: '特定の属性や要素を削除します。レイアウトに影響する可能性があります。',
    plugins: [
      'removeTitle',
      'removeDesc',
      'removeViewBox',
      'removeDimensions'
    ] as Array<keyof SvgoOptions>
  }
] as const
