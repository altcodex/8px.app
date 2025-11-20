'use client'

import { PhotoIcon } from '@heroicons/react/24/outline'
import html2canvas from 'html2canvas'
import { useCallback, useEffect, useRef, useState } from 'react'

import { WavingHandIcon } from '@/components/icons/waving-hand-icon'
import { FullPageDropZone } from '@/components/ui/full-page-drop-zone'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast'
import { getToolById } from '@/config/tools'
import { useColorHistory } from '@/contexts/color-history-context'
import type { ExtractedColor } from '@/lib/api/colors'
import { extractColorsFromImage, } from '@/lib/api/colors'
import { generateWaffleChartBlob } from '@/lib/color/waffle-chart'
import { validateImageFile } from '@/lib/file/file-validation'

export default function ImagePalettePage () {
  const tool = getToolById('image-palette')
  const toast = useToast()
  const { addColor } = useColorHistory()
  const shareTargetRef = useRef<HTMLDivElement>(null)

  // State
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [wafflePreview, setWafflePreview] = useState<string | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)

  // Fixed color count for simplicity
  const colorCount = 5

  // Cleanup blob URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  useEffect(() => {
    return () => {
      if (wafflePreview) {
        URL.revokeObjectURL(wafflePreview)
      }
    }
  }, [wafflePreview])

  // Generate waffle chart preview when colors are extracted
  useEffect(() => {
    if (extractedColors.length === 0) {
      setWafflePreview(null)
      return
    }

    generateWaffleChartBlob(extractedColors, 400).then((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        setWafflePreview(url)
      }
    })
  }, [extractedColors])

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

  // Share palette image using Web Share API
  const handleSharePalette = useCallback(async () => {
    if (!shareTargetRef.current) return

    try {
      // Capture the share target element
      const canvas = await html2canvas(shareTargetRef.current, {
        backgroundColor: '#f9fafb',
        scale: 2, // Higher resolution for better quality
        useCORS: true
      })

      // Convert to blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/png')
      })

      if (!blob) return

      const file = new File([blob], 'palette.png', { type: 'image/png' })

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'カラーパレット',
            text: '8px.appで作成したカラーパレット'
          })
        } catch (err) {
          // User cancelled or share failed
          if ((err as Error).name !== 'AbortError') {
            toast.error('シェアに失敗しました')
            console.error('Share failed:', err)
          }
        }
      } else {
        // Fallback: download the file
        toast.info('お使いのブラウザではシェア機能が使えません。画像をダウンロードしてください。')
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'palette.png'
        a.click()
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      toast.error('画像の生成に失敗しました')
      console.error('html2canvas failed:', err)
    }
  }, [toast])

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
                {/* Hidden Share Target - for html2canvas capture (without 3D transforms) */}
                <div ref={shareTargetRef} className='absolute -left-[100vw]'>
                  {/* Static image for html2canvas capture */}
                  <div className='mb-8 flex justify-center'>
                    <div
                      className='bg-white p-3 pb-12 shadow-xl'
                      style={{ transform: isFlipped ? 'rotate(2deg)' : 'rotate(-2deg)' }}
                    >
                      <img
                        src={isFlipped && wafflePreview ? wafflePreview : imagePreview!}
                        alt={isFlipped ? 'Waffle chart' : 'Uploaded'}
                        className='max-h-56 w-auto'
                      />
                    </div>
                  </div>

                  {/* Color Palette */}
                  <div className='mb-6'>
                    <div className='flex flex-wrap justify-center gap-4'>
                      {extractedColors.map((color, index) => (
                        <div
                          key={index}
                          className='size-16 rounded-full shadow-lg ring-4 ring-white sm:size-20'
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visible Flip Card */}
                <div className='mb-8 flex justify-center'>
                  <div className='relative'>
                    {/* Flip Button */}
                    <button
                      onClick={() => setIsFlipped(!isFlipped)}
                      className='absolute -right-2 -top-4 z-20 transition-transform hover:scale-110 active:scale-95'
                      title={isFlipped ? '画像を表示' : 'パレットを表示'}
                    >
                      <WavingHandIcon className='size-10' />
                    </button>

                    {/* Flip Container */}
                    <div
                      className='transition-transform duration-500'
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                      }}
                    >
                      {/* Front - Polaroid Image */}
                      <div
                        className='rotate-[-2deg] bg-white p-3 pb-12 shadow-xl dark:bg-gray-100'
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <img
                          src={imagePreview!}
                          alt='Uploaded'
                          className='max-h-56 w-auto'
                        />
                      </div>

                      {/* Back - Waffle Chart */}
                      {wafflePreview && (
                        <div
                          className='absolute inset-0 flex items-center justify-center bg-white p-3 pb-12 shadow-xl dark:bg-gray-100'
                          style={{
                            backfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg) rotate(2deg)'
                          }}
                        >
                          <img
                            src={wafflePreview}
                            alt='Waffle chart'
                            className='max-h-56 w-auto'
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className='mb-6'>
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
                  <button
                    onClick={handleSharePalette}
                    className='w-32 rounded-full bg-sky-500 py-3 font-medium text-white transition-colors hover:bg-sky-600'
                  >
                    シェア
                  </button>
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
