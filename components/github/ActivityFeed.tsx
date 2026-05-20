'use client'

import { motion } from 'framer-motion'
import {
  CircleDot,
  FolderGit2,
  GitBranch,
  GitCommitHorizontal,
  GitFork,
  GitPullRequest,
  Github,
  History,
  Rocket,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { t } from '@/lib/i18n'
import { fmt, relativeTime } from '@/lib/utils'
import type { Locale } from '@/constants/config'
import type { ActivityItem, ActivityKind } from '@/types/github'

interface ActivityFeedProps {
  lang: Locale
  items: ActivityItem[]
}

const KIND_ICON: Record<ActivityKind, LucideIcon> = {
  push: GitCommitHorizontal,
  'create-repo': FolderGit2,
  'create-branch': GitBranch,
  pr: GitPullRequest,
  star: Star,
  fork: GitFork,
  release: Rocket,
  issue: CircleDot,
  public: Github,
}

function actionText(item: ActivityItem, lang: Locale): string {
  switch (item.kind) {
    case 'push':
      return (item.count ?? 1) === 1
        ? t(lang, 'sections.github.feed.pushOne')
        : fmt(t(lang, 'sections.github.feed.push'), { n: item.count ?? 1 })
    case 'create-repo':
      return t(lang, 'sections.github.feed.createRepo')
    case 'create-branch':
      return t(lang, 'sections.github.feed.createBranch')
    case 'pr':
      return t(lang, 'sections.github.feed.pr')
    case 'star':
      return t(lang, 'sections.github.feed.star')
    case 'fork':
      return t(lang, 'sections.github.feed.fork')
    case 'release':
      return t(lang, 'sections.github.feed.release')
    case 'issue':
      return t(lang, 'sections.github.feed.issue')
    case 'public':
      return t(lang, 'sections.github.feed.public')
  }
}

export function ActivityFeed({ lang, items }: ActivityFeedProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2.5">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/40 text-[color:var(--accent)]">
          <History className="h-[18px] w-[18px]" />
        </span>
        <h3 className="text-base font-bold text-foreground">
          {t(lang, 'sections.github.feed.title')}
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="py-6 text-center text-sm text-[color:var(--muted-foreground)]">
          {t(lang, 'sections.github.feed.empty')}
        </p>
      ) : (
        <ol className="relative">
          <span
            aria-hidden
            className="absolute bottom-4 left-4 top-3 w-px bg-[color:var(--border)]"
          />
          {items.map((item, index) => (
            <FeedRow key={item.id} item={item} index={index} lang={lang} />
          ))}
        </ol>
      )}
    </div>
  )
}

function FeedRow({ item, index, lang }: { item: ActivityItem; index: number; lang: Locale }) {
  const Icon = KIND_ICON[item.kind]

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-4 pb-5 last:pb-0"
    >
      <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--muted)]/70 text-[color:var(--accent)]">
        <Icon className="h-[15px] w-[15px]" />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm leading-snug">
          <span className="text-[color:var(--muted-foreground)]">{actionText(item, lang)} </span>
          <a
            href={item.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground transition-colors hover:text-[color:var(--accent)]"
          >
            {item.repo}
          </a>
        </p>
        {item.detail && (
          <p className="mt-1 truncate font-mono text-xs text-[color:var(--muted-foreground)]">
            {item.detail}
          </p>
        )}
        <p className="mt-1 text-xs text-[color:var(--muted-foreground)]/70">
          {relativeTime(item.createdAt, lang)}
        </p>
      </div>
    </motion.li>
  )
}
