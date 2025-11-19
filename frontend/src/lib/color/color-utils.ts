/**
 * Color space conversion utilities
 * Supports: RGB ↔ Linear RGB ↔ XYZ ↔ Lab ↔ LCh
 * All conversions use D65 illuminant (standard for sRGB)
 */

// D65 white point reference values
const D65 = {
  x: 95.047,
  y: 100.0,
  z: 108.883
} as const

/**
 * RGB color (0-255 integer values)
 */
export interface RGB {
  r: number
  g: number
  b: number
}

/**
 * LCh color (perceptually uniform)
 * L: Lightness (0-100)
 * C: Chroma (0-~150, depends on hue)
 * H: Hue (0-360 degrees)
 */
export interface LCh {
  l: number
  c: number
  h: number
}

/**
 * OKLCh color (Oklab cylindrical - more perceptually uniform than LCh)
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
 * Lab color
 * L: Lightness (0-100)
 * a: green-red axis
 * b: blue-yellow axis
 */
interface Lab {
  l: number
  a: number
  b: number
}

/**
 * Oklab color (more perceptually uniform than Lab)
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
 * XYZ color (CIE 1931)
 */
interface XYZ {
  x: number
  y: number
  z: number
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
 * Convert RGB to XYZ color space
 * Uses sRGB → Linear RGB → XYZ transformation
 */
function rgbToXyz (rgb: RGB): XYZ {
  // Convert to linear RGB
  const r = rgbToLinear(rgb.r)
  const g = rgbToLinear(rgb.g)
  const b = rgbToLinear(rgb.b)

  // Apply sRGB matrix (D65)
  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041

  return {
    x: x * 100,
    y: y * 100,
    z: z * 100
  }
}

/**
 * Convert XYZ to RGB color space
 */
function xyzToRgb (xyz: XYZ): RGB {
  // Normalize
  const x = xyz.x / 100
  const y = xyz.y / 100
  const z = xyz.z / 100

  // Apply inverse sRGB matrix
  const r = x * 3.2404542 + y * -1.5371385 + z * -0.4985314
  const g = x * -0.9692660 + y * 1.8760108 + z * 0.0415560
  const b = x * 0.0556434 + y * -0.2040259 + z * 1.0572252

  // Convert from linear to sRGB
  return {
    r: linearToRgb(r),
    g: linearToRgb(g),
    b: linearToRgb(b)
  }
}

/**
 * f function for XYZ to Lab conversion
 * Handles the perceptual transformation
 */
function xyzToLabF (t: number): number {
  const delta = 6 / 29
  const deltaCubed = delta * delta * delta

  if (t > deltaCubed) {
    return Math.pow(t, 1 / 3)
  }
  return (t / (3 * delta * delta)) + (4 / 29)
}

/**
 * Inverse f function for Lab to XYZ conversion
 */
function labToXyzF (t: number): number {
  const delta = 6 / 29

  if (t > delta) {
    return Math.pow(t, 3)
  }
  return 3 * delta * delta * (t - 4 / 29)
}

/**
 * Convert XYZ to Lab color space
 */
function xyzToLab (xyz: XYZ): Lab {
  const fx = xyzToLabF(xyz.x / D65.x)
  const fy = xyzToLabF(xyz.y / D65.y)
  const fz = xyzToLabF(xyz.z / D65.z)

  const l = 116 * fy - 16
  const a = 500 * (fx - fy)
  const b = 200 * (fy - fz)

  return { l, a, b }
}

/**
 * Convert Lab to XYZ color space
 */
function labToXyz (lab: Lab): XYZ {
  const fy = (lab.l + 16) / 116
  const fx = lab.a / 500 + fy
  const fz = fy - lab.b / 200

  const x = D65.x * labToXyzF(fx)
  const y = D65.y * labToXyzF(fy)
  const z = D65.z * labToXyzF(fz)

  return { x, y, z }
}

/**
 * Convert Lab to LCh color space
 * LCh is the cylindrical representation of Lab
 */
function labToLch (lab: Lab): LCh {
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b)
  let h = Math.atan2(lab.b, lab.a) * (180 / Math.PI)

  // Normalize hue to 0-360
  if (h < 0) {
    h += 360
  }

  return {
    l: lab.l,
    c,
    h
  }
}

/**
 * Convert LCh to Lab color space
 */
function lchToLab (lch: LCh): Lab {
  const hRad = lch.h * (Math.PI / 180)

  return {
    l: lch.l,
    a: lch.c * Math.cos(hRad),
    b: lch.c * Math.sin(hRad)
  }
}

/**
 * Convert RGB to LCh (main conversion function)
 */
export function rgbToLch (rgb: RGB): LCh {
  const xyz = rgbToXyz(rgb)
  const lab = xyzToLab(xyz)
  return labToLch(lab)
}

/**
 * Convert LCh to RGB (main conversion function)
 */
export function lchToRgb (lch: LCh): RGB {
  const lab = lchToLab(lch)
  const xyz = labToXyz(lab)
  return xyzToRgb(xyz)
}

/**
 * Convert LCh to RGB with gamut mapping
 * If the color is out of sRGB gamut, reduce chroma while preserving L and H
 * Uses binary search to find maximum chroma that fits in gamut
 */
export function lchToRgbWithGamutMapping (lch: LCh): RGB {
  // First try direct conversion
  const directRgb = lchToRgb(lch)

  // Check if already in gamut (values before clamping)
  const lab = lchToLab(lch)
  const xyz = labToXyz(lab)
  const x = xyz.x / 100
  const y = xyz.y / 100
  const z = xyz.z / 100

  // Apply inverse sRGB matrix to get linear RGB
  const rLinear = x * 3.2404542 + y * -1.5371385 + z * -0.4985314
  const gLinear = x * -0.9692660 + y * 1.8760108 + z * 0.0415560
  const bLinear = x * 0.0556434 + y * -0.2040259 + z * 1.0572252

  // Check if linear values are in valid range (before gamma correction)
  // Valid linear RGB range is roughly -0.05 to 1.05 (with some tolerance)
  const inGamut = rLinear >= -0.001 && rLinear <= 1.001 &&
                  gLinear >= -0.001 && gLinear <= 1.001 &&
                  bLinear >= -0.001 && bLinear <= 1.001

  if (inGamut) {
    return directRgb
  }

  // Out of gamut - reduce chroma using binary search
  let low = 0
  let high = lch.c
  let bestC = 0

  // Binary search for maximum chroma that fits in gamut
  while (high - low > 0.01) {
    const mid = (low + high) / 2
    const testLch: LCh = { l: lch.l, c: mid, h: lch.h }
    const testLab = lchToLab(testLch)
    const testXyz = labToXyz(testLab)
    const tx = testXyz.x / 100
    const ty = testXyz.y / 100
    const tz = testXyz.z / 100

    const tr = tx * 3.2404542 + ty * -1.5371385 + tz * -0.4985314
    const tg = tx * -0.9692660 + ty * 1.8760108 + tz * 0.0415560
    const tb = tx * 0.0556434 + ty * -0.2040259 + tz * 1.0572252

    const testInGamut = tr >= -0.001 && tr <= 1.001 &&
                        tg >= -0.001 && tg <= 1.001 &&
                        tb >= -0.001 && tb <= 1.001

    if (testInGamut) {
      low = mid
      bestC = mid
    } else {
      high = mid
    }
  }

  // Convert with reduced chroma
  const mappedLch: LCh = { l: lch.l, c: bestC, h: lch.h }
  return lchToRgb(mappedLch)
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
 * Convert HEX to LCh
 */
export function hexToLch (hex: string): LCh | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  return rgbToLch(rgb)
}

/**
 * Convert LCh to HEX with gamut mapping
 * Automatically reduces chroma if color is out of sRGB gamut
 */
export function lchToHex (lch: LCh): string {
  const rgb = lchToRgbWithGamutMapping(lch)
  return rgbToHex(rgb)
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

  // Scale L to 0-100 for consistency with LCh
  // Scale C to roughly match LCh range (multiply by ~130)
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
