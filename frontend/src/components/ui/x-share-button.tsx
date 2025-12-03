'use client'

import { useEffect, useState } from 'react'

import { XIcon } from '@/components/icons/x-icon'
import { useTranslations } from '@/lib/i18n'

export function XShareButton () {
  const t = useTranslations()
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    setTitle(document.title.replace(/ \| [^ |]+$/, ''))
    setUrl(window.location.href)
  }, [])

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  return (
    <a
      href={shareUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='inline-flex w-40 items-center justify-center gap-2 rounded-full bg-gray-900 py-3 text-sm font-medium text-white outline-none transition-colors hover:bg-gray-900/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500'
    >
      <XIcon className='size-5' />
      {t('supportSection.shareOnX')}
    </a>
  )
}
