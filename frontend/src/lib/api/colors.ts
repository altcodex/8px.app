/**
 * カラー抽出API
 */

import { loadImageFromFile, processImage } from '@/lib/utils/image'

import { handleApiFetchError } from './client'

export type ExtractedColor = {
  hex: string
  percentage: number
}

/**
 * Custom error class for network errors (Cloudflare blocks, API server down, etc.)
 */
export class NetworkError extends Error {
  constructor (message: string = 'NETWORK_ERROR') {
    super(message)
    this.name = 'NetworkError'
  }
}

// NEXT_PUBLIC_API_URL is enforced and normalized at build time in next.config.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

/**
 * バックエンドAPIを使用して画像から色を抽出
 */
export async function extractColorsFromImage (
  file: File,
  numColors: number
): Promise<ExtractedColor[]> {
  // Resize image on client side to reduce bandwidth (max 300x300)
  const image = await loadImageFromFile(file)
  const resizedBlob = await processImage(image, 300, 300, { preserveAspectRatio: true })
  const resizedFile = new File([resizedBlob], file.name, { type: 'image/png' })

  const formData = new FormData()
  formData.append('file', resizedFile)

  const headers: HeadersInit = {}
  if (process.env.NEXT_PUBLIC_API_BYPASS_SECRET) {
    headers['x-vercel-protection-bypass'] = process.env.NEXT_PUBLIC_API_BYPASS_SECRET
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/colors/extract?num_colors=${numColors}`,
      {
        method: 'POST',
        body: formData,
        headers
      }
    )

    if (!response.ok) {
      const errorMessage = await handleApiFetchError(response, '色の抽出に失敗しました')
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.colors as ExtractedColor[]
  } catch (err) {
    // Network errors (Cloudflare block, API server down, CORS, etc.)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new NetworkError()
    }
    // Re-throw other errors (API errors handled by handleApiFetchError)
    throw err
  }
}
