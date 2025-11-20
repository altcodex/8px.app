'use client'

import { PhotoIcon } from '@heroicons/react/24/outline'
import { useCallback, useEffect, useRef, useState } from 'react'

import { FullPageDropZone } from '@/components/ui/full-page-drop-zone'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'
import { getToolById } from '@/config/tools'
import { useColorHistory } from '@/contexts/color-history-context'
import { validateImageFile } from '@/lib/file/file-validation'

type ExtractedColor = {
  hex: string
  percentage: number
}

// API base URL for color extraction
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Extract colors using backend API with k-means++
async function extractColorsFromImage (
  file: File,
  numColors: number
): Promise<ExtractedColor[]> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(
    `${API_BASE_URL}/api/colors/extract?num_colors=${numColors}`,
    {
      method: 'POST',
      body: formData
    }
  )

  if (!response.ok) {
    throw new Error('Failed to extract colors')
  }

  const data = await response.json()
  return data.colors as ExtractedColor[]
}

export default function ImagePalettePage () {
  const tool = getToolById('image-palette')
  const toast = useToast()
  const { addColor } = useColorHistory()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // State
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Fixed color count for simplicity
  const colorCount = 5

  // Cleanup blob URL on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  // Handle file drop/select and auto-extract
  const handleFileSelect = useCallback(async (file: File | null) => {
    if (!file) return

    // Validate file
    const error = await validateImageFile(file, {
      maxSize: 10 * 1024 * 1024,
      maxDimensions: { width: 4096, height: 4096 }
    })

    if (error) {
      toast.error(error)
      return
    }

    setExtractedColors([])
    setIsProcessing(true)

    // Create preview URL
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // Extract colors using backend API
    try {
      const colors = await extractColorsFromImage(file, colorCount)
      setExtractedColors(colors)
    } catch (err) {
      toast.error('色の抽出に失敗しました')
      console.error('Failed to extract colors:', err)
    } finally {
      setIsProcessing(false)
    }
  }, [toast, colorCount])

  // Copy color to clipboard
  const handleCopyColor = useCallback(async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex.toUpperCase())
      addColor(hex)
      toast.success('コピーしました')
    } catch (err) {
      toast.error('コピーに失敗しました')
      console.error('Failed to copy:', err)
    }
  }, [toast, addColor])

  // Download shareable palette image (waffle chart style)
  const handleDownloadPalette = useCallback(() => {
    if (extractedColors.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Canvas size for social media (1:1 ratio)
    const size = 1080
    const gridSize = 8 // 8x8 grid = 64 cells (8px.app!)
    const totalCellCount = gridSize * gridSize
    // gap = cellSize / 8 (8px.app!), solve: size = gridSize * cellSize + (gridSize - 1) * (cellSize / 8)
    const cellSize = size / (gridSize + (gridSize - 1) / 8)
    const gap = cellSize / 8
    const cornerRadius = cellSize / 8 // Same as gap for visual harmony

    canvas.width = size
    canvas.height = size

    // Calculate cell counts based on percentages (scaled to 64 cells)
    const cellCounts: number[] = []
    let totalCells = 0

    extractedColors.forEach((color) => {
      const cells = Math.round((color.percentage / 100) * totalCellCount)
      cellCounts.push(cells)
      totalCells += cells
    })

    // Adjust to exactly 64 cells
    const diff = totalCellCount - totalCells
    if (diff !== 0 && cellCounts.length > 0) {
      cellCounts[0] += diff
    }

    // Create array of colors for each cell
    const cellColors: string[] = []
    extractedColors.forEach((color, i) => {
      for (let j = 0; j < cellCounts[i]; j++) {
        cellColors.push(color.hex)
      }
    })

    // Draw waffle chart
    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize)
      const col = i % gridSize
      const x = col * (cellSize + gap)
      const y = row * (cellSize + gap)

      ctx.fillStyle = cellColors[i] || '#ffffff'
      ctx.beginPath()
      ctx.roundRect(x, y, cellSize, cellSize, cornerRadius)
      ctx.fill()
    }

    // Download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'palette.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }, [extractedColors])

  // Reset
  const handleReset = useCallback(() => {
    setImagePreview(null)
    setExtractedColors([])
  }, [])

  return (
    <FullPageDropZone
      onFileDrop={handleFileSelect}
      accept='image/*'
    >
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} className='hidden' />

      <div className='mx-auto flex min-h-[calc(100vh-12rem)] max-w-screen-md flex-col px-4'>
        {/* Header */}
        <div className='py-8 text-center'>
          <h1 className='text-3xl font-bold'>{tool?.name ?? 'イメージパレット+'}</h1>
          {!imagePreview && (
            <p className='mt-2 text-gray-500 dark:text-gray-400'>
              画像をドロップするだけでカラーパレットを作成
            </p>
          )}
        </div>

        {/* Main Content */}
        {!imagePreview && !isProcessing
          ? (
            // Upload State
            <div className='flex flex-1 items-center justify-center pb-12'>
              <label className='group flex w-full max-w-lg cursor-pointer flex-col items-center justify-center rounded-3xl border-[3px] border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 p-16 transition-all hover:border-sky-400 hover:from-sky-50 hover:to-indigo-50 dark:border-gray-600 dark:from-atom-one-dark dark:to-atom-one-dark-light dark:hover:border-sky-500 dark:hover:from-atom-one-dark-light dark:hover:to-atom-one-dark-lighter'>
                <div className='mb-6 rounded-full bg-white p-6 shadow-lg transition-transform group-hover:scale-110 dark:bg-atom-one-dark-lighter'>
                  <PhotoIcon className='size-12 text-gray-400 transition-colors group-hover:text-sky-500' />
                </div>
                <span className='mb-2 text-lg font-semibold text-gray-700 dark:text-gray-300'>
                  画像をドロップ
                </span>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  またはクリックして選択
                </span>
                <input
                  type='file'
                  accept='image/*'
                  onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                  className='hidden'
                />
              </label>
            </div>
            )
          : isProcessing
            ? (
              // Processing State
              <div className='flex flex-1 flex-col items-center justify-center pb-12'>
                <div className='relative mb-8'>
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt='Processing'
                      className='max-h-64 rounded-2xl opacity-50'
                    />
                  )}
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='rounded-full bg-white/90 p-4 shadow-lg dark:bg-atom-one-dark/90'>
                      <Spinner size={32} className='text-sky-500' />
                    </div>
                  </div>
                </div>
                <p className='text-lg font-medium text-gray-600 dark:text-gray-400'>
                  色を解析中...
                </p>
              </div>
              )
            : (
              // Result State
              <div className='flex flex-1 flex-col pb-8'>
                {/* Image Preview - Polaroid/Cheki style */}
                <div className='mb-8 flex justify-center'>
                  <div className='rotate-[-2deg] bg-white p-3 pb-12 shadow-xl dark:bg-gray-100'>
                    <img
                      src={imagePreview!}
                      alt='Uploaded'
                      className='max-h-56 w-auto'
                    />
                  </div>
                </div>

                {/* Color Palette */}
                <div className='mb-8'>
                  <div className='flex flex-wrap justify-center gap-4'>
                    {extractedColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleCopyColor(color.hex)}
                        className='transition-transform hover:scale-110 active:scale-95'
                      >
                        <div
                          className='size-16 rounded-full shadow-lg ring-4 ring-white dark:ring-gray-800 sm:size-20'
                          style={{ backgroundColor: color.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className='flex flex-col items-center gap-4'>
                  <div className='flex gap-3'>
                    <button
                      onClick={handleDownloadPalette}
                      className='w-32 rounded-full bg-sky-500 py-3 font-medium text-white transition-colors hover:bg-sky-600'
                    >
                      ダウンロード
                    </button>
                    <button
                      onClick={() => toast.info('シェア機能は開発中です')}
                      className='w-32 rounded-full border border-gray-300 py-3 font-medium transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-atom-one-dark-lighter'
                    >
                      シェア
                    </button>
                  </div>
                  <button
                    onClick={handleReset}
                    className='text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  >
                    別の画像で試す
                  </button>
                </div>
              </div>
              )}
      </div>
    </FullPageDropZone>
  )
}
