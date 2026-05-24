/**
 * Unit tests for `lib/utils.ts`.
 *
 * Coverage targets:
 *   - cn():            Tailwind-aware class merging, including conflict resolution
 *   - fmt():           {placeholder} interpolation, including the "unknown key" contract
 *   - relativeTime():  every branch of the time-bucket ladder, in both locales
 *
 * `relativeTime` is locale-aware, so each branch is asserted in BOTH `en` and
 * `tr` to prove the Intl.RelativeTimeFormat hook-up.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cn, fmt, relativeTime } from '@/lib/utils'

describe('cn', () => {
  it('joins multiple class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  it('ignores falsy values', () => {
    expect(cn('a', false, null, undefined, '', 'b')).toBe('a b')
  })

  it('honours conditional object syntax from clsx', () => {
    expect(cn('a', { b: true, c: false })).toBe('a b')
  })

  it('resolves conflicting Tailwind utility classes (last one wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})

describe('fmt', () => {
  it('replaces a single placeholder', () => {
    expect(fmt('Hello {name}', { name: 'Emre' })).toBe('Hello Emre')
  })

  it('replaces multiple placeholders', () => {
    expect(fmt('{a} + {b} = {c}', { a: 1, b: 2, c: 3 })).toBe('1 + 2 = 3')
  })

  it('coerces numeric values to strings', () => {
    expect(fmt('{n} contributions', { n: 42 })).toBe('42 contributions')
  })

  it('leaves unknown placeholders intact (lets translators spot missing data)', () => {
    expect(fmt('{known} and {unknown}', { known: 'ok' })).toBe('ok and {unknown}')
  })

  it('returns the template unchanged when there are no placeholders', () => {
    expect(fmt('no placeholders here', { x: 1 })).toBe('no placeholders here')
  })
})

describe('relativeTime', () => {
  const NOW = new Date('2025-05-24T12:00:00Z').getTime()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function isoOffsetFromNow(deltaMs: number): string {
    return new Date(NOW - deltaMs).toISOString()
  }

  describe.each([
    ['en' as const, /\b(seconds? ago|now)\b/i],
    ['tr' as const, /(saniye|şimdi|önce)/i],
  ])('locale=%s', (locale, secondsPattern) => {
    it('returns a "seconds" string for sub-minute deltas', () => {
      expect(relativeTime(isoOffsetFromNow(30_000), locale)).toMatch(secondsPattern)
    })

    it('returns a "minutes" string within an hour', () => {
      const text = relativeTime(isoOffsetFromNow(5 * 60_000), locale)
      const pattern = locale === 'en' ? /minute/i : /dakika/i
      expect(text).toMatch(pattern)
    })

    it('returns an "hours" string within a day', () => {
      const text = relativeTime(isoOffsetFromNow(3 * 60 * 60_000), locale)
      const pattern = locale === 'en' ? /hour/i : /saat/i
      expect(text).toMatch(pattern)
    })

    it('returns a "days" string within a month', () => {
      const text = relativeTime(isoOffsetFromNow(2 * 24 * 60 * 60_000), locale)
      const pattern = locale === 'en' ? /day/i : /gün/i
      expect(text).toMatch(pattern)
    })

    it('returns a "months" string within a year', () => {
      const text = relativeTime(isoOffsetFromNow(60 * 24 * 60 * 60_000), locale)
      const pattern = locale === 'en' ? /month/i : /ay/i
      expect(text).toMatch(pattern)
    })

    it('returns a "years" string for >= 1y deltas', () => {
      const text = relativeTime(isoOffsetFromNow(400 * 24 * 60 * 60_000), locale)
      const pattern = locale === 'en' ? /year/i : /yıl/i
      expect(text).toMatch(pattern)
    })
  })
})
