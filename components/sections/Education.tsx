'use client'

import { motion } from 'framer-motion'
import { GraduationCap, Award } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { CVData } from '@/types/cv'

interface EducationProps {
  lang: Locale
  cv: CVData
}

export function Education({ lang, cv }: EducationProps) {
  return (
    <SectionWrapper
      id="education"
      subtitle={t(lang, 'sections.education.subtitle')}
      title={t(lang, 'sections.education.title')}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {cv.education.map((e, i) => (
          <motion.article
            key={`${e.institution}-${e.years}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group flex gap-5 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 transition-colors hover:border-[color:var(--accent)]/40"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/40">
              <GraduationCap className="h-5 w-5 text-[color:var(--accent)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--muted-foreground)]">
                {e.years}
              </p>
              <h3 className="mt-1 text-base font-bold text-foreground md:text-lg">
                {e.institution}
              </h3>
              <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">{e.degree}</p>
              {e.grade && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--muted)]/40 px-2.5 py-1 text-xs font-medium text-foreground">
                  <Award className="h-3 w-3 text-[color:var(--accent)]" />
                  {t(lang, 'sections.education.grade')}: {e.grade}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}
