import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { MediumIcon } from '@/components/shared/MediumIcon'
import { DesignSwitchButton } from '@/components/shared/DesignSwitchButton'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { CVData } from '@/types/cv'

interface FooterProps {
  lang: Locale
  cv: CVData
}

export function Footer({ lang, cv }: FooterProps) {
  const year = new Date().getFullYear()
  const { personalInfo } = cv

  return (
    <footer className="border-t border-[color:var(--border)] bg-[color:var(--background)]">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-8">
        <div className="flex items-center gap-3 text-foreground">
          <Logo size={28} />
          <div>
            <p className="text-sm font-semibold">{personalInfo.fullName}</p>
            <p className="text-xs text-[color:var(--muted-foreground)]">{personalInfo.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`https://linkedin.com${personalInfo.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--muted)] hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" />
          </Link>
          <Link
            href={`https://github.com${personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--muted)] hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Link
            href={`https://medium.com${personalInfo.medium}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Medium"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--muted)] hover:text-foreground"
          >
            <MediumIcon className="h-4 w-4" />
          </Link>
          <Link
            href={`mailto:${personalInfo.email}`}
            aria-label="Email"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--muted-foreground)] transition-colors hover:bg-[color:var(--muted)] hover:text-foreground"
          >
            <Mail className="h-4 w-4" />
          </Link>
        </div>

        <div className="text-xs text-[color:var(--muted-foreground)] md:text-right">
          <p>
            &copy; {year} {personalInfo.fullName}. {t(lang, 'footer.rights')}
          </p>
          <p className="mt-1">{t(lang, 'footer.builtWith')}</p>
          <div className="mt-2 md:flex md:justify-end">
            <DesignSwitchButton lang={lang} variant="link" />
          </div>
        </div>
      </div>
    </footer>
  )
}
