import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { DesignProvider } from '@/components/shared/DesignProvider'
import { SITE_CONFIG } from '@/constants/config'
import { DESIGN_INIT_SCRIPT } from '@/constants/design'
import './globals.css'
import './themes/neobrutalism.css'
import './themes/design-switcher.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.name,
    template: `%s — ${SITE_CONFIG.shortName}`,
  },
  description: 'Personal portfolio',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Applies the stored design skin before first paint (see DESIGN_INIT_SCRIPT). */}
        <script dangerouslySetInnerHTML={{ __html: DESIGN_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <DesignProvider>{children}</DesignProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
