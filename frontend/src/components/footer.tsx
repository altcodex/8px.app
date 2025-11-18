import { siteConfig } from '@/config/site'

export function Footer () {
  return (
    <footer className='bg-gray-100 py-8 dark:bg-atom-one-dark-light'>
      <div className='mx-auto max-w-screen-xl px-4 text-center text-sm text-gray-600 dark:text-gray-400 sm:px-6 lg:px-8'>
        {siteConfig.name} © {new Date().getFullYear()}
      </div>
    </footer>
  )
}
