import type { Metadata } from 'next'
import { Anton, Inter, Outfit } from 'next/font/google'
import { ThemeProvider } from '@/components/shared/ThemeProvider'
import { SITE_CONFIG } from '@/constants/config'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const anton = Anton({
  subsets: ['latin', 'latin-ext'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  weight: '600',
  variable: '--font-brand',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${anton.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
