export const passwordGenerator = {
  selectCharacterTypes: '文字種を選択してください',
  copyToClipboard: 'パスワードをクリップボードにコピー',
  length: '文字数',
  characterTypes: '使用する文字',
  characterTypesHint: '選択した文字種は必ず1文字以上含まれます',
  uppercase: '大文字',
  lowercase: '小文字',
  numbers: '数字',
  symbols: '記号',
  avoidAmbiguous: '紛らわしい文字を除外',
  avoidAmbiguousHint: '0とO、1とlとIなど',
  errors: {
    copyFailed: 'コピーに失敗しました',
  },
} as const
