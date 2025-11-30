export const faviconGenerator = {
  outputOptions: '出力オプション',
  uploadHint: 'PNG, JPG, WEBP, SVGなど画像ファイルをアップロードできます (最大10MB)',
  previewPlaceholder: {
    line1: '画像を選択すると',
    line2: 'プレビューが表示されます',
  },
  fileFormat: 'ファイル形式',
  formatDescriptions: {
    favicon: '従来のブラウザ用',
    'apple-touch-icon': 'iOS用 (180×180)',
    'android-icon': 'Android/PWA用 (192×192, 512×512)',
  },
  faviconSizes: 'favicon.icoに含めるサイズ',
  recommendedSizes: '推奨サイズ',
  otherSizes: 'その他サイズ',
  borderRadius: '角丸の調整',
  borderRadiusHint:
    'アイコンの角を丸くします。Apple Touch IconはiOSが自動的に角丸にします。',
  backgroundColorSetting: '背景色の設定',
  backgroundColorHint:
    '透過PNGに背景色を追加します。Apple Touch Iconは常に背景色が適用されます。',
  addBackgroundColor: '背景色を追加する',
  selectBackgroundColor: '背景色を選択',
  backgroundColorCode: '背景色のカラーコード',
  toggleFormat: '{format}を{action}',
  toggleSize: '{size}×{size}ピクセルを{action}',
  select: '選択',
  deselect: '選択解除',
  errors: {
    imageLoadFailed: '画像の読み込みに失敗しました',
    selectImage: '画像ファイルを選択してください',
    selectOutputFormat: '少なくとも1つの出力形式を選択してください',
    selectSize: 'favicon.icoを選択した場合、少なくとも1つのサイズを選択してください',
    generateFailed: 'ファビコンの生成に失敗しました',
  },
} as const
