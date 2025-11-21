type CorkBoardBackgroundProps = {
  children: React.ReactNode
  className?: string
}

export function CorkBoardBackground ({
  children,
  className = ''
}: CorkBoardBackgroundProps) {
  return (
    <div className={`relative bg-stone-50 dark:bg-atom-one-dark ${className}`}>
      {/* Noise texture overlay using SVG filter */}
      <div
        className='pointer-events-none absolute inset-0 opacity-5'
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
        }}
      />

      {/* Light highlight (top-right) and vignette (bottom-left) for depth */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.4)_0%,transparent_50%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.08)_0%,transparent_50%,rgba(0,0,0,0.2)_100%)]' />

      <div className='relative'>
        {children}
      </div>
    </div>
  )
}
