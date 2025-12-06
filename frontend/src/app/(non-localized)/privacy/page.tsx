import { ChevronRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import { privacyPolicy } from '@/config/privacy'

function renderTextWithLinks (text: string) {
  const urlRegex = /(https:\/\/[^\s]+)/g

  return text.split(urlRegex).map((part, i) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={`privacy-link-${i}`}
          href={part}
          target='_blank'
          rel='noopener noreferrer'
          className='font-medium text-blue-600 underline hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export default function PrivacyPage () {
  return (
    <div className='mx-auto max-w-3xl'>
      {/* Simple breadcrumb without i18n */}
      <nav className='mb-6 flex min-w-0 items-center gap-2 text-sm' aria-label='Breadcrumb'>
        <Link href='/' className='truncate font-medium leading-none text-blue-600 outline-none transition-colors hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300'>
          ホーム
        </Link>
        <ChevronRightIcon className='size-4 shrink-0 text-gray-600 dark:text-gray-400' aria-hidden='true' />
        <span className='truncate font-medium leading-none text-gray-600 dark:text-gray-400' aria-current='page'>
          {privacyPolicy.title}
        </span>
      </nav>

      <div className='space-y-8'>
        {privacyPolicy.sections.map(section => (
          <section key={section.id}>
            <h2 className='mb-4 text-xl font-semibold'>{section.title}</h2>
            {section.body && (
              <p className='whitespace-pre-line'>
                {renderTextWithLinks(section.body.trim())}
              </p>
            )}
            <div className='space-y-8'>
              {section.children?.map(child => (
                <div key={child.id} className='space-y-4'>
                  <h3 className='font-semibold'>{child.subtitle}</h3>
                  <p className='whitespace-pre-line'>{renderTextWithLinks(child.body.trim())}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className='mt-12 border-t border-gray-300 pt-8 dark:border-gray-700'>
        <p>{privacyPolicy.lastUpdated}</p>
      </div>
    </div>
  )
}
