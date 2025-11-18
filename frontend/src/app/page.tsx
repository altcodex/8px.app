import { LogoIcon } from '@/components/icons/logo-icon'
import { ToolCard } from '@/components/tool-card'
import { siteConfig } from '@/config/site'
import { categories } from '@/config/tools'

export default function Home () {
  // JSON-LD構造化データ
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url
  }

  return (
    <>
      {/* JSON-LD構造化データ */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className='my-12 text-center'>
        <div className='mb-4 flex justify-center'>
          <LogoIcon className='size-16' />
        </div>
        <h1 className='mb-6 font-[Outfit] text-4xl font-semibold'>
          8px.app
        </h1>
        <p className='whitespace-pre-line font-medium text-gray-600 dark:text-gray-400'>
          {`Web開発に必要なすべてを、シンプルに。
コードとデザインの境界を越え、クリエイターの想像力を刺激する便利な機能を集めました。`}
        </p>
      </div>

      {/* Tools by Category */}
      <div className='space-y-12'>
        {categories.map((category) => (
          <div key={category.id} id={category.id}>
            {/* Category Header */}
            <div className='mb-4'>
              <h2 className='text-2xl font-semibold'>
                {category.name}
              </h2>
            </div>

            {/* Tool Cards Grid */}
            <div className='grid grid-cols-1 gap-3 lg:grid-cols-2'>
              {category.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} iconBgColor={category.iconBgColor} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
