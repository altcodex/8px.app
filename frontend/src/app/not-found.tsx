import Link from 'next/link'

export default function NotFound () {
  return (
    <html>
      <body>
        <div className='flex min-h-screen flex-col items-center justify-center gap-8 bg-atom-one-dark px-4 text-gray-300'>
          <h1 className='text-6xl font-bold'>404</h1>
          <Link
            href='/'
            className='rounded-full bg-sky-500 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-600'
          >
            Go back to homepage
          </Link>
        </div>
      </body>
    </html>
  )
}
