/**
 * 画像処理ユーティリティ
 * 再利用可能な画像処理機能を提供
 */

export type ImageProcessingOptions = {
  borderRadius?: number // pixel value
  borderRadiusPercent?: number // 0-100 (percentage, 100 = perfect circle)
  backgroundColor?: string // hex color (e.g., '#ffffff')
  preserveAspectRatio?: boolean // true = preserve aspect ratio, false = force square
}

/**
 * ファイルから画像を読み込む
 */
export async function loadImageFromFile (file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('画像の読み込みに失敗しました'))
    }

    img.src = url
  })
}

/**
 * 画像をリサイズして処理を適用
 * @param image HTMLImageElement
 * @param maxWidth 最大幅（preserveAspectRatio=falseの場合は出力幅）
 * @param maxHeight 最大高さ（preserveAspectRatio=falseの場合は出力高さ、省略時はmaxWidthと同じ）
 * @param options 処理オプション
 */
export async function processImage (
  image: HTMLImageElement,
  maxWidth: number,
  maxHeight?: number,
  options: ImageProcessingOptions = {}
): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvasコンテキストの取得に失敗しました')
  }

  // If maxHeight is not specified, use maxWidth (square)
  const maxH = maxHeight ?? maxWidth

  // サイズ計算
  let width = maxWidth
  let height = maxH

  if (options.preserveAspectRatio) {
    // アスペクト比を保持しながら、maxWidth と maxHeight の範囲内に収める
    const widthRatio = maxWidth / image.width
    const heightRatio = maxH / image.height
    const scale = Math.min(widthRatio, heightRatio, 1) // 1を超えないように（拡大しない）

    width = Math.round(image.width * scale)
    height = Math.round(image.height * scale)
  }

  canvas.width = width
  canvas.height = height

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  // 角丸を適用（正方形の場合のみ）
  let radius = 0
  let isCircle = false
  const minDimension = Math.min(width, height)

  if (!options.preserveAspectRatio) {
    if (options.borderRadius && options.borderRadius > 0) {
      radius = options.borderRadius
      // px指定で半径がmaxWidth/2以上の場合は円として扱う
      if (radius >= maxWidth / 2) {
        radius = maxWidth / 2
        isCircle = true
      }
    } else if (options.borderRadiusPercent && options.borderRadiusPercent > 0) {
      // %指定の場合、100%で完全な円
      if (options.borderRadiusPercent >= 100) {
        radius = maxWidth / 2
        isCircle = true
      } else {
        // 100%未満の場合は角丸の半径を計算
        radius = (maxWidth / 2) * (options.borderRadiusPercent / 100)
      }
    }
  }

  if (radius > 0) {
    ctx.save()
    ctx.beginPath()

    if (isCircle) {
      // 完全な円を描画
      ctx.arc(width / 2, height / 2, minDimension / 2, 0, Math.PI * 2)
    } else {
      // 角丸四角形を描画
      ctx.moveTo(radius, 0)
      ctx.lineTo(width - radius, 0)
      ctx.quadraticCurveTo(width, 0, width, radius)
      ctx.lineTo(width, height - radius)
      ctx.quadraticCurveTo(width, height, width - radius, height)
      ctx.lineTo(radius, height)
      ctx.quadraticCurveTo(0, height, 0, height - radius)
      ctx.lineTo(0, radius)
      ctx.quadraticCurveTo(0, 0, radius, 0)
    }

    ctx.closePath()
    ctx.clip()

    // 背景色を適用（クリップされた領域内のみ）
    if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor
      ctx.fillRect(0, 0, width, height)
    }

    // 画像を描画
    ctx.drawImage(image, 0, 0, width, height)

    ctx.restore()
  } else {
    // 角丸なしの場合
    // 背景色を適用
    if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor
      ctx.fillRect(0, 0, width, height)
    }

    // 画像を描画
    ctx.drawImage(image, 0, 0, width, height)
  }

  // PNG blobに変換
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvasからのblob作成に失敗しました'))
        }
      },
      'image/png',
      1.0
    )
  })
}

/**
 * Blobをダウンロード
 */
export function downloadBlob (blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
