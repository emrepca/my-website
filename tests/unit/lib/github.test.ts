/**
 * Unit tests for the pure helpers in `lib/github.ts`.
 *
 * These functions never touch the network — they only transform GitHub API
 * payloads into UI-ready shapes. Tests focus on:
 *
 *   - Boundary conditions (`clampLevel` at -1 / 0 / 4 / 5 / fractional)
 *   - Edge cases (`computeStreaks` for empty arrays and trailing-zero "today")
 *   - Business rules (`computeLanguages` excludes forks, caps at 6)
 *   - Type-safe mapping (`mapEvents` produces one ActivityItem per supported kind)
 */
import { describe, expect, it } from 'vitest'
import {
  clampLevel,
  computeLanguages,
  computeStreaks,
  mapEvents,
  sumCounts,
} from '@/lib/github'
import {
  brokenStreak,
  emptyDays,
  inProgressStreak,
  sevenDayStreak,
} from '../fixtures/contribution-days'
import {
  exoticLanguageRepos,
  manyLanguageRepos,
  mixedRepos,
  type RawRepoFixture,
} from '../fixtures/github-repos'
import {
  createBranchEvent,
  createRepoEvent,
  eventMissingRepo,
  forkEvent,
  issueLabeledEvent,
  issueOpenedEvent,
  publicEvent,
  pullRequestClosedEvent,
  pullRequestOpenedEvent,
  pushEvent,
  releaseEvent,
  type RawEventFixture,
  watchEvent,
} from '../fixtures/github-events'

// computeLanguages and mapEvents are typed against the internal Raw* shapes
// in lib/github.ts. We assert structural compatibility via the fixtures.
type ReposArg = Parameters<typeof computeLanguages>[0]
type EventsArg = Parameters<typeof mapEvents>[0]
const asRepos = (r: RawRepoFixture[]): ReposArg => r as unknown as ReposArg
const asEvents = (e: RawEventFixture[]): EventsArg => e as unknown as EventsArg

describe('sumCounts', () => {
  it('sums contribution counts across all days', () => {
    expect(sumCounts(sevenDayStreak)).toBe(4 + 2 + 1 + 7 + 3 + 9 + 11)
  })

  it('returns 0 for an empty array', () => {
    expect(sumCounts([])).toBe(0)
  })
})

describe('clampLevel', () => {
  it.each([
    [-5, 0],
    [-1, 0],
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [3.4, 3],
    [3.5, 4], // Math.round half-up
    [4, 4],
    [10, 4],
  ])('clamps %f to %i', (input, expected) => {
    expect(clampLevel(input)).toBe(expected)
  })
})

describe('computeStreaks', () => {
  it('returns 0/0 for an empty input', () => {
    expect(computeStreaks([])).toEqual({ current: 0, longest: 0 })
  })

  it('returns 0/0 when no day has any contributions', () => {
    expect(computeStreaks(emptyDays)).toEqual({ current: 0, longest: 0 })
  })

  it('counts a continuous 7-day streak as both current and longest', () => {
    expect(computeStreaks(sevenDayStreak)).toEqual({ current: 7, longest: 7 })
  })

  it('resets the current streak after a gap, but remembers the longest', () => {
    // brokenStreak: 3,2,0,4,1 — longest=2 before the gap and 2 after, current=2
    const { current, longest } = computeStreaks(brokenStreak)
    expect(longest).toBe(2)
    expect(current).toBe(2)
  })

  it('ignores a trailing-zero "today" so an in-progress day does not break the streak', () => {
    // inProgressStreak: 2,3,1,0 — today is empty so current should be 3, not 0
    expect(computeStreaks(inProgressStreak).current).toBe(3)
  })
})

describe('computeLanguages', () => {
  it('aggregates languages, excludes forks and null-language repos', () => {
    const stats = computeLanguages(asRepos(mixedRepos))
    const names = stats.map((s) => s.name)
    expect(names).toContain('TypeScript')
    expect(names).toContain('Python')
    expect(names).toContain('Go')
    expect(names).not.toContain('Rust') // would have come from the fork
  })

  it('computes per-language percentage out of the qualifying repos', () => {
    const stats = computeLanguages(asRepos(mixedRepos))
    const total = stats.reduce((sum, s) => sum + s.count, 0)
    // 3 TS + 2 PY + 1 Go = 6 qualifying repos
    expect(total).toBe(6)
    const ts = stats.find((s) => s.name === 'TypeScript')!
    expect(ts.count).toBe(3)
    expect(ts.percent).toBe(50) // 3/6 * 100
  })

  it('sorts languages by count, descending', () => {
    const stats = computeLanguages(asRepos(mixedRepos))
    for (let i = 1; i < stats.length; i += 1) {
      expect(stats[i].count).toBeLessThanOrEqual(stats[i - 1].count)
    }
  })

  it('caps the output at the top 6 languages', () => {
    const stats = computeLanguages(asRepos(manyLanguageRepos))
    expect(stats).toHaveLength(6)
  })

  it('returns an empty array when there is nothing to count', () => {
    expect(computeLanguages([])).toEqual([])
  })

  it('uses a fallback color for unknown languages', () => {
    const [stat] = computeLanguages(asRepos(exoticLanguageRepos))
    expect(stat.color).toMatch(/^#[0-9a-fA-F]{6}$/) // any valid hex
  })

  it('attaches the known brand color for popular languages', () => {
    const stats = computeLanguages(asRepos(mixedRepos))
    const ts = stats.find((s) => s.name === 'TypeScript')!
    expect(ts.color.toLowerCase()).toBe('#3178c6')
  })
})

describe('mapEvents', () => {
  it('returns an empty array for no events', () => {
    expect(mapEvents([])).toEqual([])
  })

  it('skips events without a repo name', () => {
    expect(mapEvents(asEvents([eventMissingRepo]))).toEqual([])
  })

  it('maps a PushEvent including commit count and last message', () => {
    const [item] = mapEvents(asEvents([pushEvent]))
    expect(item).toMatchObject({
      kind: 'push',
      count: 3,
      repo: 'emrepca/my-website',
      detail: 'feat: add testing', // single-line slice of the last commit
    })
    expect(item.repoUrl).toBe('https://github.com/emrepca/my-website')
  })

  it('maps a CreateEvent (repository) to "create-repo"', () => {
    const [item] = mapEvents(asEvents([createRepoEvent]))
    expect(item.kind).toBe('create-repo')
  })

  it('maps a CreateEvent (branch) to "create-branch" with the ref as detail', () => {
    const [item] = mapEvents(asEvents([createBranchEvent]))
    expect(item).toMatchObject({ kind: 'create-branch', detail: 'feature/x' })
  })

  it('maps an opened PullRequestEvent to "pr"', () => {
    const [item] = mapEvents(asEvents([pullRequestOpenedEvent]))
    expect(item.kind).toBe('pr')
  })

  it('drops a closed PullRequestEvent (we only highlight openings)', () => {
    expect(mapEvents(asEvents([pullRequestClosedEvent]))).toEqual([])
  })

  it('maps a ReleaseEvent and surfaces the tag name', () => {
    const [item] = mapEvents(asEvents([releaseEvent]))
    expect(item).toMatchObject({ kind: 'release', detail: 'v1.2.0' })
  })

  it('maps an opened IssuesEvent but drops a labeled one', () => {
    expect(mapEvents(asEvents([issueOpenedEvent]))[0].kind).toBe('issue')
    expect(mapEvents(asEvents([issueLabeledEvent]))).toEqual([])
  })

  it('maps WatchEvent → star, ForkEvent → fork, PublicEvent → public', () => {
    expect(mapEvents(asEvents([watchEvent]))[0].kind).toBe('star')
    expect(mapEvents(asEvents([forkEvent]))[0].kind).toBe('fork')
    expect(mapEvents(asEvents([publicEvent]))[0].kind).toBe('public')
  })

  it('caps the output at 8 items even when more are supplied', () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      ...pushEvent,
      id: `push-${i}`,
    }))
    expect(mapEvents(asEvents(many))).toHaveLength(8)
  })
})
