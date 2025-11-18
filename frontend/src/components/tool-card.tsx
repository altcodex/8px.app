import Image from 'next/image'
import Link from 'next/link'

import type { Tool } from '@/config/tools'

type ToolCardProps = {
  tool: Tool
}

// グレーのプレースホルダーSVG（base64エンコード）
const placeholderSvg = `data:image/svg+xml;base64,${btoa(`
  <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" fill="#e5e7eb"/>
  </svg>
`)}`

export function ToolCard ({ tool }: ToolCardProps) {
  return (
    <Link
      href={tool.href}
      className='group flex w-full items-center gap-4 rounded-lg p-4 text-left outline-none transition-colors hover:bg-gray-100 focus-visible:bg-gray-100 dark:hover:bg-atom-one-dark-light focus-visible:dark:bg-atom-one-dark-light'
    >
      {/* Tool Icon */}
      <div className='relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700'>
        <Image
          src={`https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(tool.name)}`}
          alt={tool.name}
          width={48}
          height={48}
          unoptimized
          placeholder='blur'
          blurDataURL={placeholderSvg}
        />
      </div>

      {/* Tool Info */}
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <h3 className='font-semibold'>
          {tool.name}
        </h3>
        <p className='line-clamp-3 text-sm text-gray-600 dark:text-gray-400'>
          {tool.description}
        </p>
      </div>
    </Link>
  )
}
