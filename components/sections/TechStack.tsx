'use client'

import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { CVData } from '@/types/cv'

interface TechStackProps {
  lang: Locale
  cv: CVData
}

export function TechStack({ lang, cv }: TechStackProps) {
  const entries = Object.entries(cv.skills)

  return (
    <SectionWrapper
      id="tech-stack"
      subtitle={t(lang, 'sections.techStack.subtitle')}
      title={t(lang, 'sections.techStack.title')}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([category, items], i) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 transition-colors hover:border-[color:var(--accent)]/40"
          >
            <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-foreground">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              {category}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-lg border border-[color:var(--border)] bg-[color:var(--muted)]/30 px-2.5 py-1 text-xs font-medium text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--muted)] hover:text-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  )
}
