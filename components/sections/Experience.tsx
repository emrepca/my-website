'use client'

import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion'
import { Building2, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { CVData, WorkExperienceItem } from '@/types/cv'

interface ExperienceProps {
  lang: Locale
  cv: CVData
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 56 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function Experience({ lang, cv }: ExperienceProps) {
  const items = cv.workExperience
  const total = items.length
  const [activeIndex, setActiveIndex] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<Array<HTMLDivElement | null>>([])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 25%', 'end 75%'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.55,
  })
  const progressHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  const handleJump = (i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="section-padding relative scroll-mt-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute left-[10%] top-1/3 h-[420px] w-[420px] rounded-full bg-[color:var(--accent)] opacity-[0.06] blur-[140px]" />
        <div className="absolute right-[5%] bottom-1/4 h-[360px] w-[360px] rounded-full bg-purple-500 opacity-[0.05] blur-[140px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--accent)] backdrop-blur"
            >
              <Sparkles className="h-3 w-3" />
              {t(lang, 'sections.experience.subtitle')}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="mt-5 text-3xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl"
            >
              {t(lang, 'sections.experience.title')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
              className="mt-5 max-w-md text-base leading-relaxed text-[color:var(--muted-foreground)] md:text-lg"
            >
              {t(lang, 'sections.experience.support')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 hidden lg:flex lg:items-start lg:gap-5"
            >
              <div className="relative flex w-px flex-shrink-0 self-stretch min-h-[200px]">
                <div className="absolute inset-0 w-px bg-[color:var(--border)]" />
                <motion.div
                  style={{ height: progressHeight }}
                  className="absolute inset-x-0 top-0 w-px bg-gradient-to-b from-[color:var(--accent)] via-[color:var(--accent)] to-[color:var(--accent)]/0"
                />
                {items.map((_, i) => {
                  const reached = i <= activeIndex
                  const isActive = i === activeIndex
                  const top = total > 1 ? (i / (total - 1)) * 100 : 50
                  return (
                    <motion.span
                      key={i}
                      style={{ top: `${top}%` }}
                      animate={{
                        scale: isActive ? 1.25 : 1,
                        boxShadow: isActive
                          ? '0 0 0 6px color-mix(in srgb, var(--accent) 18%, transparent)'
                          : '0 0 0 0px transparent',
                      }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 block h-2.5 w-2.5 rounded-full border-2 ${
                        reached
                          ? 'border-[color:var(--accent)] bg-[color:var(--accent)]'
                          : 'border-[color:var(--border)] bg-[color:var(--background)]'
                      }`}
                    />
                  )
                })}
              </div>

              <div className="flex flex-col gap-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--muted-foreground)]/70">
                  {t(lang, 'sections.experience.progress')}
                </p>
                <ul className="flex flex-col gap-4">
                  {items.map((w, i) => {
                    const isActive = i === activeIndex
                    return (
                      <li key={`${w.company}-${i}`}>
                        <button
                          type="button"
                          onClick={() => handleJump(i)}
                          className="group flex flex-col items-start text-left"
                        >
                          <span
                            className={`font-mono text-[10px] tracking-widest transition-colors ${
                              isActive
                                ? 'text-[color:var(--accent)]'
                                : 'text-[color:var(--muted-foreground)]/60'
                            }`}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`mt-0.5 text-sm font-semibold transition-colors ${
                              isActive
                                ? 'text-foreground'
                                : 'text-[color:var(--muted-foreground)] group-hover:text-foreground/80'
                            }`}
                          >
                            {w.company}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </motion.div>
          </aside>

          <div className="flex flex-col gap-12 md:gap-16">
            {items.map((item, i) => (
              <ExperienceCard
                key={`${item.company}-${i}`}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                item={item}
                index={i}
                total={total}
                lang={lang}
                isActive={i === activeIndex}
                onActivate={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface ExperienceCardProps {
  ref: (el: HTMLDivElement | null) => void
  item: WorkExperienceItem
  index: number
  total: number
  lang: Locale
  isActive: boolean
  onActivate: () => void
}

function ExperienceCard({
  ref,
  item,
  index,
  total,
  lang,
  isActive,
  onActivate,
}: ExperienceCardProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(innerRef, {
    amount: 0.4,
    margin: '-30% 0px -30% 0px',
  })

  useEffect(() => {
    if (inView) onActivate()
  }, [inView, onActivate])

  const isPresent = index === 0
  const counter = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`

  return (
    <div
      ref={(el) => {
        ref(el)
        innerRef.current = el
      }}
    >
      <motion.article
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        animate={{
          scale: isActive ? 1 : 0.97,
          opacity: isActive ? 1 : 0.45,
          filter: isActive ? 'blur(0px)' : 'blur(0.6px)',
        }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-0.5 -z-10 rounded-[28px] bg-gradient-to-br from-[color:var(--accent)]/60 via-purple-500/40 to-fuchsia-500/30 opacity-0 blur-2xl transition-opacity duration-700 ${
            isActive ? 'opacity-60' : 'opacity-0'
          }`}
        />

        <div
          className={`relative overflow-hidden rounded-3xl border bg-[color:var(--card)]/55 p-6 backdrop-blur-2xl transition-[border-color,box-shadow] duration-500 md:p-9 ${
            isActive
              ? 'border-[color:var(--accent)]/45 shadow-[0_40px_120px_-40px_color-mix(in_srgb,var(--accent)_70%,transparent)]'
              : 'border-[color:var(--border)] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.55)]'
          }`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              background:
                'radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 55%)',
            }}
          />
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-fuchsia-500 blur-3xl transition-opacity duration-700 ${
              isActive ? 'opacity-25' : 'opacity-0'
            }`}
          />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.18em] text-[color:var(--muted-foreground)]/70">
                {counter}
              </span>
              <span className="h-px w-10 bg-gradient-to-r from-[color:var(--border)] to-transparent" />
            </div>
            <div className="flex items-center gap-2">
              {isPresent && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                  {t(lang, 'sections.experience.presentLabel')}
                </span>
              )}
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--background)]/60 px-3 py-1 text-[11px] font-medium text-[color:var(--muted-foreground)] backdrop-blur">
                {item.date}
              </span>
            </div>
          </div>

          <div className="relative mt-7 flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]">
              <div
                aria-hidden="true"
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-purple-500 opacity-0 blur-md transition-opacity ${
                  isActive ? 'opacity-50' : ''
                }`}
              />
              <Building2 className="relative h-[18px] w-[18px] text-[color:var(--accent)]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                {t(lang, 'sections.experience.label')}
              </p>
              <p className="mt-0.5 truncate text-base font-semibold text-foreground">
                {item.company}
              </p>
            </div>
          </div>

          <h3 className="relative mt-5 text-2xl font-bold leading-[1.15] tracking-tight text-foreground md:text-[28px]">
            {item.role}
          </h3>

          {item.technologies && item.technologies.length > 0 && (
            <div className="relative mt-6">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]/70">
                {t(lang, 'sections.experience.stack')}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {item.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[color:var(--border)] bg-[color:var(--muted)]/30 px-2.5 py-1 text-[11px] font-medium text-foreground/80 backdrop-blur"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="relative mt-7">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]/70">
              {t(lang, 'sections.experience.highlights')}
            </p>
            <ul className="space-y-2.5">
              {item.responsibilities.map((r, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[color:var(--muted-foreground)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-br from-[color:var(--accent)] to-purple-400 shadow-[0_0_8px_color-mix(in_srgb,var(--accent)_60%,transparent)]"
                  />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.article>
    </div>
  )
}
