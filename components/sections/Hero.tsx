'use client'

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Globe, Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { Logo } from '@/components/shared/Logo'
import { NAV_ITEMS, type Locale } from '@/constants/config'
import { t } from '@/lib/i18n'
import type { CVData } from '@/types/cv'

interface HeroProps {
  lang: Locale
  cv: CVData
}

const HERO_BACKGROUND = '/hero/hero_orange_background.png'
const HERO_PORTRAIT = '/hero/portfolio_portre_nobackground.png'

/** Short list shown inline in the white panel; the full list lives behind the menu button. */
const INLINE_NAV_IDS = ['about', 'projects', 'experience', 'contact'] as const

const EASE_OUT = [0.16, 1, 0.3, 1] as const

export function Hero({ lang, cv }: HeroProps) {
  const { personalInfo } = cv
  const sectionRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const otherLang: Locale = lang === 'en' ? 'tr' : 'en'
  const otherLangPath = pathname.replace(/^\/(en|tr)/, `/${otherLang}`) || `/${otherLang}`

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 })

  // Gentle depth on scroll: the portrait drifts slower than the headline.
  const portraitY = useTransform(progress, [0, 1], [0, 120])
  const headlineY = useTransform(progress, [0, 1], [0, 220])
  const headlineOpacity = useTransform(progress, [0, 0.6], [1, 0])

  const inlineNav = NAV_ITEMS.filter((item) =>
    (INLINE_NAV_IDS as readonly string[]).includes(item.id)
  )

  return (
    <section ref={sectionRef} lang={lang} className="relative h-[100svh] min-h-[640px] bg-[#9a3d0c] p-2 md:p-3">
      <div className="relative h-full w-full overflow-hidden rounded-[20px] md:rounded-[28px]">
        <Image
          src={HERO_BACKGROUND}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Deepen the left edge so the white type keeps its contrast */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#5a1f04]/50 via-transparent to-transparent"
          aria-hidden="true"
        />

        {/* White content panel (desktop) */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
          className="absolute bottom-3 right-3 top-3 hidden w-[49%] rounded-[22px] bg-[#fbfaf8] shadow-[0_30px_80px_-30px_rgba(60,20,0,0.45)] lg:block"
          aria-hidden="true"
        />

        {/* Portrait — overlaps the seam between the orange field and the white panel */}
        <div className="pointer-events-none absolute bottom-0 right-[-18%] z-10 aspect-[1232/1277] h-[62%] sm:right-[-6%] sm:h-[72%] lg:left-[51%] lg:right-auto lg:h-[90%] lg:-translate-x-[52%]">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.15 }}
          style={{ y: portraitY, transformOrigin: 'center bottom' }}
          className="relative h-full w-full"
        >
          <div
            className="absolute inset-[12%] rounded-full bg-[#ffb347] opacity-40 blur-[90px]"
            aria-hidden="true"
          />
          <Image
            src={HERO_PORTRAIT}
            alt={t(lang, 'hero.portraitAlt')}
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 90vw"
            className="select-none object-contain object-bottom"
          />
        </motion.div>
        </div>

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8 lg:pr-9">
          <Link href={`/${lang}`} className="text-white" aria-label="Home">
            <Logo size={30} withMark />
          </Link>

          <nav className="flex items-center gap-1" aria-label="Hero">
            <div className="hidden items-center gap-1 lg:flex">
              {inlineNav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-700 transition-colors hover:text-[#c2510f]"
                >
                  {t(lang, item.key)}
                </a>
              ))}
              <Link
                href={otherLangPath}
                aria-label={t(lang, 'common.language')}
                className="ml-2 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500 transition-colors hover:text-[#c2510f]"
              >
                <Globe className="h-3.5 w-3.5" />
                {otherLang}
              </Link>
            </div>

            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={t(lang, 'common.menu')}
                aria-expanded={menuOpen}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 lg:bg-neutral-100 lg:text-neutral-800 lg:hover:bg-neutral-200"
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-14 w-56 origin-top-right rounded-2xl bg-white p-2 shadow-[0_20px_60px_-15px_rgba(60,20,0,0.35)]"
                  >
                    {NAV_ITEMS.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-orange-50 hover:text-[#c2510f]"
                      >
                        {t(lang, item.key)}
                      </a>
                    ))}
                    <Link
                      href={otherLangPath}
                      className="mt-1 flex items-center gap-2 rounded-xl border-t border-neutral-100 px-3 py-2 text-sm font-medium uppercase text-neutral-500 hover:bg-orange-50 hover:text-[#c2510f]"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {otherLang}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        {/* Headline block */}
        <div className="absolute left-6 right-6 top-28 z-20 md:left-10 md:top-32 lg:right-auto lg:top-1/2 lg:-translate-y-1/2">
        <motion.div style={{ y: headlineY, opacity: headlineOpacity }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
            className="font-display text-[29vw] uppercase leading-[0.82] text-white drop-shadow-[0_10px_40px_rgba(90,30,0,0.25)] sm:text-[22vw] lg:text-[clamp(8rem,15.5vw,16rem)]"
          >
            <span className="sr-only">
              {personalInfo.fullName} — {personalInfo.title}.{' '}
            </span>
            <span aria-hidden="true">{t(lang, 'hero.headline')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.25 }}
            className="mt-5 text-lg font-light leading-snug text-white/90 md:mt-7 md:text-2xl"
          >
            {t(lang, 'hero.taglineLine1')}
            <br />
            {t(lang, 'hero.taglineLine2')}
          </motion.p>

          <motion.a
            href="#projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.35 }}
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-[#7a2e0a] shadow-[0_0_40px_-6px_rgba(255,220,180,0.9)] transition-shadow hover:shadow-[0_0_55px_-4px_rgba(255,230,200,1)] md:mt-9"
          >
            {t(lang, 'hero.viewWork')}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        </motion.div>
        </div>

        {/* Availability — in the white panel */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.45 }}
          className="absolute right-[7%] top-[30%] z-20 hidden w-[16%] lg:block"
        >
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#c2510f]">
            {t(lang, 'hero.availableLabel')}
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8681a] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e8681a]" />
            </span>
          </p>
          <p className="mt-3 text-3xl font-medium leading-[1.1] tracking-tight text-neutral-900 xl:text-4xl">
            {t(lang, 'hero.availableTitle')}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
