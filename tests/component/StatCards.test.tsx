/**
 * Component tests for `components/github/StatCards.tsx`.
 *
 * These tests verify the component contract that recruiters / future-me care
 * about:
 *   - All 6 cards render with their canonical labels (en and tr)
 *   - Numbers are formatted via Intl.NumberFormat for the active locale
 *   - The "longest streak" sub-label appears when the longest streak > 0
 *   - The "top language" dot inherits the language color
 *
 * We mock `useCountUp` to short-circuit the rAF animation — that hook has its
 * own behavior; here we care about render output only.
 */
import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { StatCards } from '@/components/github/StatCards'
import { t } from '@/lib/i18n'
import { renderWithLang } from '../setup/test-utils'
import type { GitHubStats } from '@/types/github'

vi.mock('@/hooks/useCountUp', () => ({
  useCountUp: (target: number) => target,
}))

const stats: GitHubStats = {
  repos: 1234,
  contributions: 567,
  stars: 89,
  followers: 42,
  currentStreak: 5,
  longestStreak: 12,
  topLanguage: 'TypeScript',
  topLanguageColor: '#3178c6',
  accountYear: 2020,
  yearsActive: 5,
}

describe('StatCards', () => {
  it.each(['en', 'tr'] as const)('renders all six canonical card labels in %s', (lang) => {
    renderWithLang(<StatCards lang={lang} stats={stats} />, { lang })

    const labels = [
      t(lang, 'sections.github.stats.repos'),
      t(lang, 'sections.github.stats.contributions'),
      t(lang, 'sections.github.stats.streak'),
      t(lang, 'sections.github.stats.stars'),
      t(lang, 'sections.github.stats.language'),
      t(lang, 'sections.github.stats.active'),
    ]
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('formats large numbers with the English locale (1,234)', () => {
    renderWithLang(<StatCards lang="en" stats={stats} />, { lang: 'en' })
    expect(screen.getByText('1,234')).toBeInTheDocument()
  })

  it('formats large numbers with the Turkish locale (1.234)', () => {
    renderWithLang(<StatCards lang="tr" stats={stats} />, { lang: 'tr' })
    expect(screen.getByText('1.234')).toBeInTheDocument()
  })

  it('renders the top-language card with the actual language name', () => {
    renderWithLang(<StatCards lang="en" stats={stats} />, { lang: 'en' })
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('renders the longest-streak sub label when longestStreak > 0', () => {
    renderWithLang(<StatCards lang="en" stats={stats} />, { lang: 'en' })
    expect(screen.getByText(/longest run: 12 days/i)).toBeInTheDocument()
  })

  it('renders the plain "consecutive days" sub label when no longest streak yet', () => {
    renderWithLang(
      <StatCards lang="en" stats={{ ...stats, longestStreak: 0 }} />,
      { lang: 'en' },
    )
    expect(screen.getByText('consecutive days')).toBeInTheDocument()
  })

  it('falls back to a dash when no top language is available', () => {
    renderWithLang(
      <StatCards
        lang="en"
        stats={{ ...stats, topLanguage: null, topLanguageColor: null }}
      />,
      { lang: 'en' },
    )
    // The card with label "Top language" should render an em-dash.
    const card = screen.getByText('Top language').closest('div')!.parentElement!
    expect(within(card).getByText('—')).toBeInTheDocument()
  })

  it('renders the account year as the "active" card value', () => {
    renderWithLang(<StatCards lang="en" stats={stats} />, { lang: 'en' })
    expect(screen.getByText('2020')).toBeInTheDocument()
    expect(screen.getByText('5 years on GitHub')).toBeInTheDocument()
  })
})
