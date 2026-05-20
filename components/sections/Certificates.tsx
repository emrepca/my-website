'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Award } from 'lucide-react'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { PdfThumbnail } from '@/components/shared/PdfThumbnail'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'

interface CertificatesProps {
  lang: Locale
  certificates: string[]
}

export function Certificates({ lang, certificates }: CertificatesProps) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [active])

  return (
    <SectionWrapper
      id="certificates"
      subtitle={t(lang, 'sections.certifications.subtitle')}
      title={t(lang, 'sections.certifications.title')}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((url, i) => (
          <motion.button
            key={url}
            type="button"
            onClick={() => setActive(url)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] text-left transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)]/50 hover:shadow-[0_0_50px_-15px_var(--accent)]"
            aria-label={t(lang, 'sections.certifications.openPdf')}
          >
            <div className="flex-1 overflow-hidden">
              <PdfThumbnail url={url} scale={1.4} className="h-full" />
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-[color:var(--border)] bg-[color:var(--card)] px-4 py-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[color:var(--accent)]" />
                <span className="text-xs font-medium text-[color:var(--muted-foreground)]">
                  PDF
                </span>
              </div>
              <ExternalLink className="h-4 w-4 text-[color:var(--muted-foreground)] transition-colors group-hover:text-foreground" />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative h-full max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-4 py-3">
                <a
                  href={active}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--accent)] hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {lang === 'tr' ? 'Yeni sekmede aç' : 'Open in new tab'}
                </a>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  aria-label={t(lang, 'sections.certifications.close')}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--border)] text-foreground transition-colors hover:bg-[color:var(--muted)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="h-[calc(100%-3.25rem)] overflow-auto bg-[color:var(--muted)]/40">
                <iframe
                  src={`${active}#view=FitH`}
                  title="Certificate"
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionWrapper>
  )
}
