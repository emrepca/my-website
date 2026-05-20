'use client'

import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, MapPin, Languages } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { CVData } from '@/types/cv'

interface AboutProps {
  lang: Locale
  cv: CVData
}

export function About({ lang, cv }: AboutProps) {
  const { professionalSummary, personalInfo, education } = cv

  const stats = [
    {
      icon: Briefcase,
      label: lang === 'tr' ? 'Deneyim' : 'Experience',
      value: '1+',
    },
    {
      icon: GraduationCap,
      label: lang === 'tr' ? 'Diploma' : 'Degrees',
      value: `${education.length}`,
    },
    {
      icon: MapPin,
      label: lang === 'tr' ? 'Konum' : 'Location',
      value: personalInfo.city,
    },
    {
      icon: Languages,
      label: lang === 'tr' ? 'Diller' : 'Languages',
      value: personalInfo.languages.split('(')[0].trim(),
    },
  ]

  return (
    <SectionWrapper
      id="about"
      subtitle={t(lang, 'sections.about.subtitle')}
      title={t(lang, 'sections.about.title')}
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-8 md:p-10"
        >
          <p className="text-lg leading-relaxed text-foreground md:text-xl">
            {professionalSummary}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5"
            >
              <s.icon className="h-5 w-5 text-[color:var(--accent)]" />
              <p className="mt-3 text-2xl font-bold text-foreground">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-[color:var(--muted-foreground)]">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  )
}
