/**
 * Color space conversion utilities
 * Supports: RGB ↔ Linear RGB ↔ Oklab ↔ OKLCh
 */

/**
 * RGB color (0-255 integer values)
 */
export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * OKLCh color (Oklab cylindrical - perceptually uniform)
 * L: Lightness (0-1, but we scale to 0-100 for consistency)
 * C: Chroma (0-~0.4, but we scale for consistency)
 * H: Hue (0-360 degrees)
 */
export interface OKLCh {
  l: number
  c: number
  h: number
}

/**
 * Oklab color (perceptually uniform color space)
 * L: Lightness (0-1)
 * a: green-red axis
 * b: blue-yellow axis
 */
interface Oklab {
  l: number
  a: number
  b: number
}

/**
 * Clamp value between min and max
 */
function clamp (value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Convert RGB (0-255) to linear RGB (0-1)
 * Apply inverse sRGB gamma correction
 */
function rgbToLinear (value: number): number {
  const v = value / 255
  if (v <= 0.04045) {
    return v / 12.92
  }
  return Math.pow((v + 0.055) / 1.055, 2.4)
}

/**
 * Convert linear RGB (0-1) to RGB (0-255)
 * Apply sRGB gamma correction
 */
function linearToRgb (value: number): number {
  if (value <= 0.0031308) {
    return clamp(Math.round(value * 12.92 * 255), 0, 255)
  }
  return clamp(Math.round((1.055 * Math.pow(value, 1 / 2.4) - 0.055) * 255), 0, 255)
}

/**
 * Parse HEX color string to RGB
 * Supports: #RGB, #RRGGBB
 */
export function hexToRgb (hex: string): RGB | null {
  // Remove # if present
  hex = hex.replace(/^#/, '')

  // Expand shorthand (#RGB to #RRGGBB)
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }

  if (hex.length !== 6) {
    return null
  }

  const num = parseInt(hex, 16)
  if (isNaN(num)) {
    return null
  }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

/**
 * Convert RGB to HEX color string
 */
export function rgbToHex (rgb: RGB): string {
  const r = clamp(Math.round(rgb.r), 0, 255)
  const g = clamp(Math.round(rgb.g), 0, 255)
  const b = clamp(Math.round(rgb.b), 0, 255)

  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
}

/**
 * Interpolate between two values
 */
export function lerp (a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/**
 * Normalize hue to 0-360 range
 */
export function normalizeHue (hue: number): number {
  hue = hue % 360
  if (hue < 0) hue += 360
  return hue
}

/**
 * Convert linear RGB to Oklab
 * Oklab is a more perceptually uniform color space than Lab
 */
function linearRgbToOklab (r: number, g: number, b: number): Oklab {
  // Convert to LMS cone response
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  // Apply cube root
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  // Convert to Oklab
  return {
    l: 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  }
}

/**
 * Convert Oklab to linear RGB
 */
function oklabToLinearRgb (oklab: Oklab): { r: number, g: number, b: number } {
  // Convert to LMS
  const l_ = oklab.l + 0.3963377774 * oklab.a + 0.2158037573 * oklab.b
  const m_ = oklab.l - 0.1055613458 * oklab.a - 0.0638541728 * oklab.b
  const s_ = oklab.l - 0.0894841775 * oklab.a - 1.2914855480 * oklab.b

  // Cube to get cone response
  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  // Convert to linear RGB
  return {
    r: +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  }
}

/**
 * Convert RGB to Oklab
 */
export function rgbToOklab (rgb: RGB): Oklab {
  const r = rgbToLinear(rgb.r)
  const g = rgbToLinear(rgb.g)
  const b = rgbToLinear(rgb.b)
  return linearRgbToOklab(r, g, b)
}

/**
 * Convert Oklab to RGB
 */
export function oklabToRgb (oklab: Oklab): RGB {
  const linear = oklabToLinearRgb(oklab)
  return {
    r: linearToRgb(linear.r),
    g: linearToRgb(linear.g),
    b: linearToRgb(linear.b)
  }
}

/**
 * Convert Oklab to OKLCh
 */
function oklabToOklch (oklab: Oklab): OKLCh {
  const c = Math.sqrt(oklab.a * oklab.a + oklab.b * oklab.b)
  let h = Math.atan2(oklab.b, oklab.a) * (180 / Math.PI)

  if (h < 0) {
    h += 360
  }

  // Scale L to 0-100 for easier interpretation
  // Scale C to a larger range (multiply by ~130)
  return {
    l: oklab.l * 100,
    c: c * 130,
    h
  }
}

/**
 * Convert OKLCh to Oklab
 */
function oklchToOklab (oklch: OKLCh): Oklab {
  const hRad = oklch.h * (Math.PI / 180)

  // Unscale from our 0-100 range
  return {
    l: oklch.l / 100,
    a: (oklch.c / 130) * Math.cos(hRad),
    b: (oklch.c / 130) * Math.sin(hRad)
  }
}

/**
 * Convert RGB to OKLCh
 */
export function rgbToOklch (rgb: RGB): OKLCh {
  const oklab = rgbToOklab(rgb)
  return oklabToOklch(oklab)
}

/**
 * Convert OKLCh to RGB
 */
export function oklchToRgb (oklch: OKLCh): RGB {
  const oklab = oklchToOklab(oklch)
  return oklabToRgb(oklab)
}

/**
 * Convert HEX to OKLCh
 */
export function hexToOklch (hex: string): OKLCh | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToOklch(rgb)
}

/**
 * Convert OKLCh to HEX with gamut mapping
 */
export function oklchToHex (oklch: OKLCh): string {
  const rgb = oklchToRgbWithGamutMapping(oklch)
  return rgbToHex(rgb)
}

/**
 * Convert OKLCh to RGB with gamut mapping
 * If the color is out of sRGB gamut, reduce chroma while preserving L and H
 */
export function oklchToRgbWithGamutMapping (oklch: OKLCh): RGB {
  // First try direct conversion
  const directRgb = oklchToRgb(oklch)

  // Check if already in gamut
  const oklab = oklchToOklab(oklch)
  const linear = oklabToLinearRgb(oklab)

  const inGamut = linear.r >= -0.001 && linear.r <= 1.001 &&
                  linear.g >= -0.001 && linear.g <= 1.001 &&
                  linear.b >= -0.001 && linear.b <= 1.001

  if (inGamut) {
    return directRgb
  }

  // Out of gamut - reduce chroma using binary search
  let low = 0
  let high = oklch.c
  let bestC = 0

  while (high - low > 0.01) {
    const mid = (low + high) / 2
    const testOklch: OKLCh = { l: oklch.l, c: mid, h: oklch.h }
    const testOklab = oklchToOklab(testOklch)
    const testLinear = oklabToLinearRgb(testOklab)

    const testInGamut = testLinear.r >= -0.001 && testLinear.r <= 1.001 &&
                        testLinear.g >= -0.001 && testLinear.g <= 1.001 &&
                        testLinear.b >= -0.001 && testLinear.b <= 1.001

    if (testInGamut) {
      low = mid
      bestC = mid
    } else {
      high = mid
    }
  }

  const mappedOklch: OKLCh = { l: oklch.l, c: bestC, h: oklch.h }
  return oklchToRgb(mappedOklch)
}

/**
 * HSL color
 * H: Hue (0-360 degrees)
 * S: Saturation (0-100%)
 * L: Lightness (0-100%)
 */
export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * CMYK color
 * C: Cyan (0-100%)
 * M: Magenta (0-100%)
 * Y: Yellow (0-100%)
 * K: Key/Black (0-100%)
 */
export interface CMYK {
  c: number
  m: number
  y: number
  k: number
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl (rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / delta + 2) / 6
        break
      case b:
        h = ((r - g) / delta + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convert HEX to HSL
 */
export function hexToHsl (hex: string): HSL | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToHsl(rgb)
}

/**
 * Convert RGB to CMYK
 */
export function rgbToCmyk (rgb: RGB): CMYK {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const k = 1 - Math.max(r, g, b)

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 }
  }

  const c = (1 - r - k) / (1 - k)
  const m = (1 - g - k) / (1 - k)
  const y = (1 - b - k) / (1 - k)

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  }
}

/**
 * Convert HEX to CMYK
 */
export function hexToCmyk (hex: string): CMYK | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToCmyk(rgb)
}
