export const svgOptimizer = {
  uploadHint: 'SVGファイルをアップロードできます (最大10MB)',
  previewPlaceholder: {
    line1: 'SVGファイルを選択すると',
    line2: 'プレビューが表示されます',
  },
  original: '元のファイル',
  optimized: '最適化後',
  compressionRatio: '圧縮率',
  preset: 'プリセット',
  safe: '推奨',
  'svgo-default': '標準圧縮',
  maximum: '最大圧縮',
  custom: 'カスタム',
  selectPreset: '{preset}を選択',
  precisionSettings: '精度設定',
  precisionHint:
    '数値の精度を調整します。値が低いほど圧縮率が高くなりますが、精度が低下します。',
  floatPrecision: '小数点以下の桁数',
  transformPrecision: 'transform属性の精度',
  options: '最適化オプション',
  groups: {
    cleanup: 'クリーンアップ',
    optimization: '最適化',
    structural: '構造変更',
    advanced: '高度な設定',
    dangerous: '危険な設定',
    dangerousDescription:
      'セキュリティリスクがあります。信頼できるSVGファイルのみ使用してください。',
  },
  errors: {
    svgLoadFailed: 'SVGファイルの読み込みに失敗しました',
    selectSvg: 'SVGファイルを選択してください',
    optimizeFailed: 'SVGの最適化に失敗しました',
  },
} as const
