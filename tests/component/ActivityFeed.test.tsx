/**
 * Component tests for `components/github/ActivityFeed.tsx`.
 *
 * Covers:
 *   - Empty-state copy in both locales
 *   - One row per ActivityItem, including the localized action text
 *   - Singular vs plural push event copy ("Pushed a commit" vs "Pushed N commits")
 *   - Detail line renders for events that carry detail (push, release, branch)
 *   - External repo links open in a new tab
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { ActivityFeed } from '@/components/github/ActivityFeed'
import { t } from '@/lib/i18n'
import { renderWithLang } from '../setup/test-utils'
import type { ActivityItem } from '@/types/github'

const NOW = new Date('2025-05-24T12:00:00Z').getTime()

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

const baseItem = (overrides: Partial<ActivityItem>): ActivityItem => ({
  id: 'evt-1',
  kind: 'push',
  repo: 'emrepca/my-website',
  repoUrl: 'https://github.com/emrepca/my-website',
  detail: null,
  count: null,
  createdAt: new Date(NOW - 60_000).toISOString(),
  ...overrides,
})

describe('ActivityFeed', () => {
  it.each(['en', 'tr'] as const)('renders the localized empty state in %s', (lang) => {
    renderWithLang(<ActivityFeed lang={lang} items={[]} />, { lang })
    expect(screen.getByText(t(lang, 'sections.github.feed.empty'))).toBeInTheDocument()
  })

  it('renders one row per activity item with the repo name as a link', () => {
    const items: ActivityItem[] = [
      baseItem({ id: 'a', kind: 'star', repo: 'emrepca/one' }),
      baseItem({ id: 'b', kind: 'fork', repo: 'emrepca/two' }),
      baseItem({ id: 'c', kind: 'release', repo: 'emrepca/three', detail: 'v1.0' }),
    ]
    renderWithLang(<ActivityFeed lang="en" items={items} />, { lang: 'en' })

    expect(screen.getByRole('link', { name: 'emrepca/one' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'emrepca/two' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'emrepca/three' })).toBeInTheDocument()
  })

  it('uses the singular push copy when count is 1', () => {
    const items = [baseItem({ kind: 'push', count: 1 })]
    renderWithLang(<ActivityFeed lang="en" items={items} />, { lang: 'en' })
    expect(screen.getByText(/Pushed a commit to/i)).toBeInTheDocument()
  })

  it('uses the plural push copy with the count interpolated', () => {
    const items = [baseItem({ kind: 'push', count: 5 })]
    renderWithLang(<ActivityFeed lang="en" items={items} />, { lang: 'en' })
    expect(screen.getByText(/Pushed 5 commits to/i)).toBeInTheDocument()
  })

  it('renders the detail line for events that carry one', () => {
    const items = [
      baseItem({ kind: 'release', detail: 'v2.4.1' }),
      baseItem({ id: 'b', kind: 'create-branch', detail: 'feature/new' }),
    ]
    renderWithLang(<ActivityFeed lang="en" items={items} />, { lang: 'en' })
    expect(screen.getByText('v2.4.1')).toBeInTheDocument()
    expect(screen.getByText('feature/new')).toBeInTheDocument()
  })

  it('marks external repo links as target=_blank with safe rel attributes', () => {
    const items = [baseItem({ kind: 'star', repo: 'emrepca/safe' })]
    renderWithLang(<ActivityFeed lang="en" items={items} />, { lang: 'en' })
    const link = screen.getByRole('link', { name: 'emrepca/safe' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('renders a relative-time label below each entry', () => {
    const items = [baseItem({ createdAt: new Date(NOW - 5 * 60_000).toISOString() })]
    renderWithLang(<ActivityFeed lang="en" items={items} />, { lang: 'en' })
    // jsdom's Intl renders "5 minutes ago" in English
    const li = screen.getByRole('listitem')
    expect(within(li).getByText(/minute/i)).toBeInTheDocument()
  })
})
