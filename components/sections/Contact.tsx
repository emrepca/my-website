'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, Linkedin, Github, MapPin, ArrowUpRight } from 'lucide-react'
import { MediumIcon } from '@/components/shared/MediumIcon'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { CVData } from '@/types/cv'

interface ContactProps {
  lang: Locale
  cv: CVData
}

export function Contact({ lang, cv }: ContactProps) {
  const { personalInfo } = cv

  const items = [
    {
      icon: Mail,
      label: t(lang, 'sections.contact.email'),
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: Phone,
      label: t(lang, 'sections.contact.phone'),
      value: personalInfo.phone,
      href: `tel:${personalInfo.phone.replace(/\s+/g, '')}`,
    },
    {
      icon: Linkedin,
      label: t(lang, 'sections.contact.linkedin'),
      value: `linkedin.com${personalInfo.linkedin}`,
      href: `https://linkedin.com${personalInfo.linkedin}`,
    },
    {
      icon: Github,
      label: t(lang, 'sections.contact.github'),
      value: `github.com${personalInfo.github}`,
      href: `https://github.com${personalInfo.github}`,
    },
    {
      icon: MediumIcon,
      label: t(lang, 'sections.contact.medium'),
      value: `medium.com${personalInfo.medium}`,
      href: `https://medium.com${personalInfo.medium}`,
    },
    {
      icon: MapPin,
      label: t(lang, 'sections.contact.location'),
      value: personalInfo.city,
      href: null,
    },
  ]

  return (
    <SectionWrapper
      id="contact"
      subtitle={t(lang, 'sections.contact.subtitle')}
      title={t(lang, 'sections.contact.title')}
    >
      <div className="overflow-hidden rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)]">
        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1.2fr_1fr] md:gap-12 md:p-12">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-foreground md:text-3xl">
              {lang === 'tr'
                ? 'Bir mesaj göndermekten çekinmeyin'
                : 'Feel free to reach out anytime'}
            </h3>
            <p className="mt-3 text-base text-[color:var(--muted-foreground)]">
              {lang === 'tr'
                ? 'Yeni fırsatlar, iş birlikleri veya sadece sohbet için açığım.'
                : "Open to new opportunities, collaborations, or just a friendly chat."}
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--accent-foreground)] shadow-[0_0_30px_-8px_var(--accent)] transition-all hover:bg-[color:var(--accent-hover)]"
            >
              <Mail className="h-4 w-4" />
              {t(lang, 'sections.contact.sendEmail')}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {items.map((item, i) => {
              const Inner = (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group flex items-center gap-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/20 p-4 transition-colors hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--muted)]/40"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[color:var(--border)] bg-[color:var(--card)]">
                    <item.icon className="h-4 w-4 text-[color:var(--accent)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--muted-foreground)]">
                      {item.label}
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">{item.value}</p>
                  </div>
                  {item.href && (
                    <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-[color:var(--muted-foreground)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  )}
                </motion.div>
              )

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block"
                >
                  {Inner}
                </a>
              ) : (
                <div key={item.label}>{Inner}</div>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
