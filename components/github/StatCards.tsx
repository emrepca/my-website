'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Activity,
  CalendarClock,
  Code2,
  Flame,
  FolderGit2,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { useCountUp } from '@/hooks/useCountUp'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/utils'
import type { Locale } from '@/constants/config'
import type { GitHubStats } from '@/types/github'

interface StatCardsProps {
  lang: Locale
  stats: GitHubStats
}

type StatCard =
  | { key: string; icon: LucideIcon; variant: 'number'; value: number; sub: string }
  | { key: string; icon: LucideIcon; variant: 'text'; value: string; sub: string; dot?: string | null }

export function StatCards({ lang, stats }: StatCardsProps) {
  const cards: StatCard[] = [
    {
      key: 'repos',
      icon: FolderGit2,
      variant: 'number',
      value: stats.repos,
      sub: t(lang, 'sections.github.stats.reposSub'),
    },
    {
      key: 'contributions',
      icon: Activity,
      variant: 'number',
      value: stats.contributions,
      sub: t(lang, 'sections.github.stats.contributionsSub'),
    },
    {
      key: 'streak',
      icon: Flame,
      variant: 'number',
      value: stats.currentStreak,
      sub:
        stats.longestStreak > 0
          ? fmt(t(lang, 'sections.github.stats.streakSubLongest'), { n: stats.longestStreak })
          : t(lang, 'sections.github.stats.streakSub'),
    },
    {
      key: 'stars',
      icon: Star,
      variant: 'number',
      value: stats.stars,
      sub: t(lang, 'sections.github.stats.starsSub'),
    },
    {
      key: 'language',
      icon: Code2,
      variant: 'text',
      value: stats.topLanguage ?? '—',
      sub: t(lang, 'sections.github.stats.languageSub'),
      dot: stats.topLanguageColor,
    },
    {
      key: 'active',
      icon: CalendarClock,
      variant: 'text',
      value: String(stats.accountYear),
      sub: fmt(t(lang, 'sections.github.stats.activeSub'), { n: stats.yearsActive }),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <StatCardItem key={card.key} lang={lang} card={card} index={index} />
      ))}
    </div>
  )
}

function StatCardItem({ lang, card, index }: { lang: Locale; card: StatCard; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const Icon = card.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 transition-colors duration-300 hover:border-[color:var(--accent)]/40 hover:shadow-[0_0_45px_-15px_var(--accent)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[color:var(--accent)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-20"
      />

      <div className="relative flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/40 text-[color:var(--accent)] transition-colors duration-300 group-hover:bg-[color:var(--accent)]/10">
          <Icon className="h-[18px] w-[18px]" />
        </span>
        {card.variant === 'text' && card.dot && (
          <span
            className="mt-1 h-2.5 w-2.5 rounded-full ring-2 ring-[color:var(--card)]"
            style={{ backgroundColor: card.dot }}
          />
        )}
      </div>

      <div className="relative mt-4">
        {card.variant === 'number' ? (
          <CountValue lang={lang} value={card.value} start={inView} />
        ) : (
          <p className="truncate text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {card.value}
          </p>
        )}
      </div>

      <p className="relative mt-1 text-sm font-semibold text-foreground">
        {t(lang, `sections.github.stats.${card.key}`)}
      </p>
      <p className="relative mt-0.5 text-xs text-[color:var(--muted-foreground)]">{card.sub}</p>
    </motion.div>
  )
}

function CountValue({ lang, value, start }: { lang: Locale; value: number; start: boolean }) {
  const animated = useCountUp(value, { start })
  return (
    <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
      {new Intl.NumberFormat(lang).format(Math.round(animated))}
    </p>
  )
}
