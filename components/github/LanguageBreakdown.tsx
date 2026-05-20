'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2 } from 'lucide-react'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { LanguageStat } from '@/types/github'

interface LanguageBreakdownProps {
  lang: Locale
  languages: LanguageStat[]
}

export function LanguageBreakdown({ lang, languages }: LanguageBreakdownProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6"
    >
      <div className="mb-5 flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/40 text-[color:var(--accent)]">
          <Code2 className="h-[18px] w-[18px]" />
        </span>
        <h3 className="text-base font-bold text-foreground">
          {t(lang, 'sections.github.languages.title')}
        </h3>
      </div>

      {languages.length === 0 ? (
        <p className="py-6 text-center text-sm text-[color:var(--muted-foreground)]">
          {t(lang, 'sections.github.languages.empty')}
        </p>
      ) : (
        <>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[color:var(--muted)]/50">
            {languages.map((language, index) => (
              <motion.div
                key={language.name}
                initial={{ width: 0 }}
                animate={inView ? { width: `${language.percent}%` } : { width: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ backgroundColor: language.color }}
              />
            ))}
          </div>

          <ul className="mt-5 space-y-3.5">
            {languages.map((language, index) => (
              <motion.li
                key={language.name}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.07 }}
                className="flex items-center gap-3"
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: language.color }}
                />
                <span className="flex-1 truncate text-sm font-medium text-foreground">
                  {language.name}
                </span>
                <span className="text-sm font-semibold tabular-nums text-[color:var(--muted-foreground)]">
                  {language.percent}%
                </span>
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
