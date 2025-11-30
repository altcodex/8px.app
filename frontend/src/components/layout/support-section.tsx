import { OfuseButton } from '@/components/ui/ofuse-button'
import { ShareButton } from '@/components/ui/share-button'
import { XShareButton } from '@/components/ui/x-share-button'

export function SupportSection () {
  return (
    <div className='mx-auto mb-16 mt-24 flex flex-col items-center justify-center gap-4 sm:mb-24 sm:mt-32 sm:flex-row'>
      <XShareButton />
      <ShareButton />
      <OfuseButton />
    </div>
  )
}
