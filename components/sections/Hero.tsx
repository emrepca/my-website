'use client'

import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Mail, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRef } from 'react'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { CVData } from '@/types/cv'

interface HeroProps {
  lang: Locale
  cv: CVData
}

const HERO_ILLUSTRATION = '/hero/developer-hero.png'

export function Hero({ lang, cv }: HeroProps) {
  const { personalInfo, professionalSummary } = cv
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Spring-smoothed scroll progress → Apple-style physics on every derived value.
  // Reversible (no `restDelta` clamp), so scrolling back up restores cleanly.
  const dockProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.6,
  })

  // Desktop dock minimize: scale toward 0.25, drop downward, fade with mid-stop, soft blur on exit.
  const illustrationScale = useTransform(dockProgress, [0, 1], [1, 0.25])
  const illustrationY = useTransform(dockProgress, [0, 1], [0, 340])
  const illustrationOpacity = useTransform(dockProgress, [0, 0.55, 1], [1, 0.6, 0])
  const illustrationBlurPx = useTransform(dockProgress, [0, 1], [0, 6])
  const illustrationFilter = useMotionTemplate`blur(${illustrationBlurPx}px)`

  // Mobile: simplified vertical scale + fade, no horizontal drift, no blur cost.
  const mobileIllustrationOpacity = useTransform(dockProgress, [0, 0.7], [0.18, 0])
  const mobileIllustrationScale = useTransform(dockProgress, [0, 1], [1, 0.7])
  const mobileIllustrationY = useTransform(dockProgress, [0, 1], [0, 60])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0 hero-grid" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[color:var(--accent)] opacity-[0.12] blur-[120px]"
        aria-hidden="true"
      />

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.18, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        style={{
          opacity: mobileIllustrationOpacity,
          scale: mobileIllustrationScale,
          y: mobileIllustrationY,
          transformOrigin: 'center bottom',
          willChange: 'transform, opacity',
        }}
        className="pointer-events-none absolute inset-0 -z-[1] flex items-center justify-center lg:hidden"
      >
        <Image
          src={HERO_ILLUSTRATION}
          alt=""
          width={720}
          height={720}
          priority
          className="h-auto w-[115%] max-w-none object-contain"
        />
      </motion.div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 md:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/40 px-3 py-1 text-xs font-medium text-[color:var(--muted-foreground)] backdrop-blur"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            {t(lang, 'hero.availability')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
          >
            {personalInfo.fullName.split(' ').slice(0, -1).join(' ')}{' '}
            <span className="text-gradient">{personalInfo.fullName.split(' ').slice(-1)}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 flex items-center gap-2 text-lg font-medium text-[color:var(--muted-foreground)] md:text-xl"
          >
            <Sparkles className="h-4 w-4 text-[color:var(--accent)]" />
            {personalInfo.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-[color:var(--muted-foreground)] md:text-lg"
          >
            {professionalSummary}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-[0_0_30px_-8px_var(--accent)] transition-all hover:bg-[color:var(--accent-hover)] hover:shadow-[0_0_40px_-4px_var(--accent)]"
            >
              {t(lang, 'hero.viewProjects')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/40 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-[color:var(--muted)]"
            >
              <Mail className="h-4 w-4" />
              {t(lang, 'hero.contactMe')}
            </a>
          </motion.div>
        </div>

        <motion.div
          style={{
            opacity: illustrationOpacity,
            y: illustrationY,
            scale: illustrationScale,
            filter: illustrationFilter,
            transformOrigin: 'center bottom',
            willChange: 'transform, opacity, filter',
          }}
          className="relative hidden lg:flex lg:justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.1, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative w-full max-w-[440px]"
          >
            <div
              className="absolute -inset-10 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-purple-500 opacity-25 blur-3xl"
              aria-hidden="true"
            />
            <Image
              src={HERO_ILLUSTRATION}
              alt={t(lang, 'hero.illustrationAlt') || 'Developer illustration'}
              width={560}
              height={560}
              priority
              className="relative h-auto w-full select-none drop-shadow-2xl"
            />

            <div className="absolute -bottom-2 -right-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 px-3 py-2 text-xs font-mono text-[color:var(--muted-foreground)] shadow-lg backdrop-blur">
              <span className="text-[color:var(--accent)]">{`<`}</span>
              portfolio
              <span className="text-[color:var(--accent)]">{` />`}</span>
            </div>
            <div className="absolute -top-2 -left-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--card)]/90 px-3 py-2 text-xs font-mono text-[color:var(--muted-foreground)] shadow-lg backdrop-blur">
              <span className="text-emerald-400">●</span> {personalInfo.city}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
