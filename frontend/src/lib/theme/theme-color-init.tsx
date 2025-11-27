import Script from 'next/script'

/**
 * Initializes theme-color meta tag based on stored theme preference
 * Runs before page interactive to prevent flash
 */
export function ThemeColorInit () {
  return (
    <Script
      id='theme-color-init'
      strategy='beforeInteractive'
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const theme = localStorage.getItem('theme');
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const resolved = theme === 'dark' || (theme === 'system' && isDark) ? 'dark' : 'light';

            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
              meta.setAttribute('content', resolved === 'dark' ? '#282c34' : '#ffffff');
            }
          })();
        `
      }}
    />
  )
}
