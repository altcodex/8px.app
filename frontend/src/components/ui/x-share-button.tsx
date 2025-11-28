'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { XIcon } from '@/components/icons/x-icon'

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
      className='inline-flex w-48 items-center justify-center gap-2 rounded-full bg-black py-3 font-medium text-white transition-colors hover:bg-black/70'
    >
      <XIcon className='size-5' />
      {t('supportSection.shareOnX')}
    </a>
  )
}
