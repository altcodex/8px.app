'use client'

import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import type { DragEvent, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface FullPageDropZoneProps {
  onFileDrop: (file: File) => void
  validateFile?: (file: File) => string | null | Promise<string | null>
  accept?: string // e.g., "image/*"
  children: ReactNode
}

export function FullPageDropZone ({
  onFileDrop,
  validateFile,
  accept,
  children
}: FullPageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounterRef = useRef(0)

  const handleDragEnter = useCallback(() => {
    dragCounterRef.current++
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback(() => {
    dragCounterRef.current = 0
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: globalThis.DragEvent) => {
    e.preventDefault()
  }, [])

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter)
    window.addEventListener('dragleave', handleDragLeave)
    window.addEventListener('drop', handleDrop)
    window.addEventListener('dragover', handleDragOver)

    return () => {
      window.removeEventListener('dragenter', handleDragEnter)
      window.removeEventListener('dragleave', handleDragLeave)
      window.removeEventListener('drop', handleDrop)
      window.removeEventListener('dragover', handleDragOver)
    }
  }, [handleDragEnter, handleDragLeave, handleDrop, handleDragOver])

  const handleDropOnDiv = useCallback(async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // Reset drag counter and state
    dragCounterRef.current = 0
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file) return

    // Validate file type if accept prop is provided
    if (accept && !isFileTypeAccepted(file, accept)) {
      return
    }

    // Validate file with custom validator
    if (validateFile) {
      const error = await validateFile(file)
      if (error) {
        return
      }
    }

    onFileDrop(file)
  }, [accept, validateFile, onFileDrop])

  return (
    <div onDrop={handleDropOnDiv} className='relative'>
      {children}

      {/* Drag Overlay */}
      {isDragging && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-blue-500/10 p-8 backdrop-blur'>
          <div className='flex size-full flex-col items-center justify-center gap-4 rounded-2xl border-4 border-dashed border-blue-500'>
            <DocumentPlusIcon className='size-12' />
            <p className='text-xl font-semibold'>
              ドロップして画像をアップロード
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to check if file type is accepted
function isFileTypeAccepted (file: File, accept: string): boolean {
  const acceptedTypes = accept.split(',').map(type => type.trim())

  return acceptedTypes.some(type => {
    if (type.endsWith('/*')) {
      // e.g., "image/*"
      const category = type.split('/')[0]
      return file.type.startsWith(`${category}/`)
    }
    // e.g., ".png", ".jpg"
    if (type.startsWith('.')) {
      return file.name.toLowerCase().endsWith(type.toLowerCase())
    }
    // Exact mime type match
    return file.type === type
  })
}
