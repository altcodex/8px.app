/**
 * チェキサイズとアスペクト比の決定
 */

export type ChekiAspectRatio = 'portrait' | 'square' | 'landscape'

export type ChekiSize = {
  width: number
  height: number
  aspectRatio: ChekiAspectRatio
}

export type ChekiPadding = {
  left: number
  right: number
  top: number
  bottom: number
}

// サイズパターン（基準となる長辺のサイズ、16の倍数）
const SIZE_BREAKPOINTS = [400, 640, 800, 1024, 1280]

/**
 * 画像のアスペクト比を判定
 */
export function determineAspectRatio (
  width: number,
  height: number
): ChekiAspectRatio {
  const ratio = width / height

  // 正方形に近い場合（0.9 ~ 1.1）
  if (ratio >= 0.9 && ratio <= 1.1) {
    return 'square'
  }

  // 横長
  if (ratio > 1.1) {
    return 'landscape'
  }

  // 縦長
  return 'portrait'
}

/**
 * 適切なチェキサイズを決定
 */
export function determineChekiSize (
  width: number,
  height: number
): ChekiSize {
  const aspectRatio = determineAspectRatio(width, height)

  // 長辺を基準にサイズを決定
  const longerSide = Math.max(width, height)

  // 最も近いブレークポイントを見つける（小さい画像は最小サイズまで拡大）
  let targetSize = SIZE_BREAKPOINTS[0]
  for (const breakpoint of SIZE_BREAKPOINTS) {
    if (longerSide <= breakpoint) {
      targetSize = breakpoint
      break
    }
    targetSize = breakpoint
  }

  // アスペクト比に応じて幅と高さを決定
  let targetWidth: number
  let targetHeight: number

  if (aspectRatio === 'portrait') {
    // 縦長: 長辺が高さ、幅は46mm基準
    targetHeight = targetSize
    targetWidth = Math.round(targetSize * (46 / 62))
  } else if (aspectRatio === 'square') {
    // 正方形: 幅と高さが同じ
    targetWidth = targetSize
    targetHeight = targetSize
  } else {
    // 横長: 長辺が幅、高さは62mm基準
    targetWidth = targetSize
    targetHeight = Math.round(targetSize * (62 / 99))
  }

  return {
    width: targetWidth,
    height: targetHeight,
    aspectRatio
  }
}

/**
 * チェキの余白を計算
 * 実物のチェキフィルムの比率に基づく
 */
export function calculateChekiPadding (
  imageWidth: number,
  imageHeight: number,
  aspectRatio: ChekiAspectRatio
): ChekiPadding {
  // 余白の比率（画像サイズに対する%）
  const paddingRatios = {
    portrait: {
      horizontal: 0.087, // 4mm / 46mm = 8.70%
      top: 0.129, // 8mm / 62mm = 12.9%
      bottom: 0.258 // 16mm / 62mm = 25.8%
    },
    square: {
      horizontal: 0.0806, // 5mm / 62mm = 8.06%
      top: 0.129, // 8mm / 62mm = 12.9%
      bottom: 0.258 // 16mm / 62mm = 25.8%
    },
    landscape: {
      horizontal: 0.0455, // 4.5mm / 99mm = 4.55%
      top: 0.129, // 8mm / 62mm = 12.9%
      bottom: 0.258 // 16mm / 62mm = 25.8%
    }
  }

  const ratios = paddingRatios[aspectRatio]

  return {
    left: Math.round(imageWidth * ratios.horizontal),
    right: Math.round(imageWidth * ratios.horizontal),
    top: Math.round(imageHeight * ratios.top),
    bottom: Math.round(imageHeight * ratios.bottom)
  }
}
