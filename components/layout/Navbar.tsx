'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, X, Globe } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { DesignSwitchButton } from '@/components/shared/DesignSwitchButton'
import { NAV_ITEMS, type Locale } from '@/constants/config'
import { t } from '@/lib/i18n'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@/lib/utils'

interface NavbarProps {
  lang: Locale
}

export function Navbar({ lang }: NavbarProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const activeId = useScrollSpy(NAV_ITEMS.map((i) => i.id))

  const otherLang: Locale = lang === 'en' ? 'tr' : 'en'
  const otherLangPath = pathname.replace(/^\/(en|tr)/, `/${otherLang}`) || `/${otherLang}`

  const current = mounted ? resolvedTheme ?? theme : 'dark'
  const isDark = current === 'dark'

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass' : 'bg-transparent'
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-8">
        <Link href={`/${lang}`} className="flex items-center gap-2 text-foreground" aria-label="Home">
          <Logo size={28} />
          <span className="hidden text-sm font-semibold tracking-tight sm:inline">Emre Paça</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={cn(
                'relative rounded-full px-3.5 py-1.5 text-sm font-medium text-[color:var(--muted-foreground)] transition-colors hover:text-foreground',
                activeId === item.id && 'text-foreground'
              )}
            >
              {activeId === item.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-full bg-[color:var(--muted)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                />
              )}
              {t(lang, item.key)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={otherLangPath}
            aria-label={t(lang, 'common.language')}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/40 px-3 text-xs font-semibold uppercase tracking-wider text-foreground transition-colors hover:bg-[color:var(--muted)]"
          >
            <Globe className="h-3.5 w-3.5" />
            {otherLang}
          </Link>

          <DesignSwitchButton lang={lang} />

          <button
            type="button"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={isDark ? t(lang, 'common.lightMode') : t(lang, 'common.darkMode')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/40 text-foreground transition-colors hover:bg-[color:var(--muted)]"
          >
            {mounted ? (
              isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4 opacity-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={t(lang, 'common.menu')}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/40 text-foreground md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="glass border-t border-[color:var(--border)] md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-[color:var(--muted-foreground)] hover:bg-[color:var(--muted)] hover:text-foreground"
                >
                  {t(lang, item.key)}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
