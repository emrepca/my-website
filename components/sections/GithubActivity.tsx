'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, RefreshCw, TriangleAlert } from 'lucide-react'
import { t } from '@/lib/i18n'
import { fmt, relativeTime } from '@/lib/utils'
import { GITHUB_USERNAME, type Locale } from '@/constants/config'
import type { GitHubData } from '@/types/github'
import { StatCards } from '@/components/github/StatCards'
import { ContributionHeatmap } from '@/components/github/ContributionHeatmap'
import { ActivityFeed } from '@/components/github/ActivityFeed'
import { LanguageBreakdown } from '@/components/github/LanguageBreakdown'

interface GithubActivityProps {
  lang: Locale
}

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: GitHubData }

const PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
const EASE = [0.16, 1, 0.3, 1] as const

export function GithubActivity({ lang }: GithubActivityProps) {
  const [state, setState] = useState<State>({ status: 'loading' })

  const load = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/github', { cache: 'no-store' })
      if (!res.ok) throw new Error('Request failed')
      const data = (await res.json()) as GitHubData
      if (!data.ok) throw new Error('Empty payload')
      setState({ status: 'ready', data })
    } catch {
      setState({ status: 'error' })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <section id="github" className="section-padding relative scroll-mt-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[6%] top-1/4 h-[420px] w-[420px] rounded-full bg-[color:var(--accent)] opacity-[0.05] blur-[150px]" />
        <div className="absolute left-[4%] bottom-1/4 h-[320px] w-[320px] rounded-full bg-purple-500 opacity-[0.04] blur-[150px]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <Header lang={lang} state={state} onRefresh={load} />

        {state.status === 'loading' && <DashboardSkeleton />}
        {state.status === 'error' && <ErrorState lang={lang} onRetry={load} />}
        {state.status === 'ready' && <Dashboard lang={lang} data={state.data} />}
      </div>
    </section>
  )
}

/* --------------------------------- Header --------------------------------- */

function Header({
  lang,
  state,
  onRefresh,
}: {
  lang: Locale
  state: State
  onRefresh: () => void
}) {
  const data = state.status === 'ready' ? state.data : null

  return (
    <div className="mb-12 md:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE }}
        className="flex flex-wrap items-center gap-3"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/60 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[color:var(--accent)] backdrop-blur">
          <Github className="h-3 w-3" />
          {t(lang, 'sections.github.subtitle')}
        </span>
        {state.status === 'ready' && (
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            {t(lang, 'sections.github.live')}
          </span>
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
        className="mt-5 text-3xl font-bold leading-[1.08] tracking-tight text-foreground md:text-5xl"
      >
        {t(lang, 'sections.github.title')}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
        className="mt-4 max-w-2xl text-base leading-relaxed text-[color:var(--muted-foreground)] md:text-lg"
      >
        {t(lang, 'sections.github.support')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.18 }}
        className="mt-6 flex flex-wrap items-center gap-3"
      >
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/60 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--muted)]"
        >
          <Github className="h-4 w-4" />
          @{GITHUB_USERNAME}
          <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--muted-foreground)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        {data && (
          <button
            type="button"
            onClick={onRefresh}
            className="group inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/40 px-3.5 py-2 text-xs font-medium text-[color:var(--muted-foreground)] transition-colors hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" />
            {fmt(t(lang, 'sections.github.updated'), {
              time: relativeTime(data.generatedAt, lang),
            })}
          </button>
        )}
      </motion.div>
    </div>
  )
}

/* -------------------------------- Dashboard ------------------------------- */

function Dashboard({ lang, data }: { lang: Locale; data: GitHubData }) {
  return (
    <div className="space-y-6">
      {data.stats && <StatCards lang={lang} stats={data.stats} />}
      {data.calendar && <ContributionHeatmap lang={lang} calendar={data.calendar} />}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_5fr]">
        <ActivityFeed lang={lang} items={data.activity} />
        <LanguageBreakdown lang={lang} languages={data.languages} />
      </div>
    </div>
  )
}

/* ------------------------------ Error state ------------------------------- */

function ErrorState({ lang, onRetry }: { lang: Locale; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] px-6 py-14 text-center">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--muted)]/40 text-[color:var(--accent)]">
        <TriangleAlert className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground">
        {t(lang, 'sections.github.error.title')}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-[color:var(--muted-foreground)]">
        {t(lang, 'sections.github.error.body')}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-[color:var(--accent-foreground)] transition-colors hover:bg-[color:var(--accent-hover)]"
        >
          <RefreshCw className="h-4 w-4" />
          {t(lang, 'sections.github.error.retry')}
        </button>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/60 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-[color:var(--muted)]"
        >
          <Github className="h-4 w-4" />
          {t(lang, 'sections.github.error.profile')}
        </a>
      </div>
    </div>
  )
}

/* ------------------------------- Skeleton --------------------------------- */

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5"
          >
            <div className="h-10 w-10 animate-pulse rounded-xl bg-[color:var(--muted)]" />
            <div className="mt-4 h-8 w-20 animate-pulse rounded bg-[color:var(--muted)]" />
            <div className="mt-2.5 h-3.5 w-24 animate-pulse rounded bg-[color:var(--muted)]" />
            <div className="mt-2 h-3 w-32 animate-pulse rounded bg-[color:var(--muted)]/60" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[color:var(--muted)]" />
        <div className="mt-6 flex gap-[3px] overflow-hidden">
          {Array.from({ length: 53 }).map((_, col) => (
            <div key={col} className="flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, row) => (
                <div
                  key={row}
                  className="h-3 w-3 animate-pulse rounded-[2px] bg-[color:var(--muted)]"
                  style={{ animationDelay: `${(col + row) * 16}ms` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[7fr_5fr]">
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
          <div className="h-6 w-36 animate-pulse rounded bg-[color:var(--muted)]" />
          <div className="mt-6 space-y-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-[color:var(--muted)]" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-[color:var(--muted)]" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-[color:var(--muted)]/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
          <div className="h-6 w-36 animate-pulse rounded bg-[color:var(--muted)]" />
          <div className="mt-6 h-2.5 w-full animate-pulse rounded-full bg-[color:var(--muted)]" />
          <div className="mt-5 space-y-3.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-[color:var(--muted)]" />
                <div className="h-3.5 flex-1 animate-pulse rounded bg-[color:var(--muted)]" />
                <div className="h-3.5 w-8 animate-pulse rounded bg-[color:var(--muted)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
