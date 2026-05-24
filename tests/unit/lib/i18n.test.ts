/**
 * Unit tests for `lib/i18n.ts`.
 *
 * The translation layer is the contract that every UI component depends on,
 * so we pin three behaviours that are easy to regress:
 *
 *   1. Locale dispatch — `getDict` returns the right dictionary for en/tr.
 *   2. Graceful fallback — unknown locales fall back to English without throwing.
 *   3. Dot-path lookup — `t` traverses nested keys and, on miss, returns the
 *      path itself so a missing key shows up visibly in the UI instead of
 *      silently rendering "undefined".
 */
import { describe, expect, it } from 'vitest'
import { getDict, t } from '@/lib/i18n'
import uiEn from '@/translations/ui-en.json'
import uiTr from '@/translations/ui-tr.json'

describe('getDict', () => {
  it('returns the English dictionary for "en"', () => {
    expect(getDict('en')).toBe(uiEn)
  })

  it('returns the Turkish dictionary for "tr"', () => {
    expect(getDict('tr')).toBe(uiTr)
  })

  it('falls back to English when given an unsupported locale', () => {
    // Cast intentional — we're checking the runtime fallback path that exists
    // because translation files may load lazily in the future.
    expect(getDict('fr' as never)).toBe(uiEn)
  })
})

describe('t', () => {
  it('resolves a top-level key', () => {
    expect(t('en', 'nav.about')).toBe('About')
    expect(t('tr', 'nav.about')).toBe('Hakkımda')
  })

  it('resolves a deeply nested dot path', () => {
    expect(t('en', 'sections.github.stats.repos')).toBe('Repositories')
    expect(t('tr', 'sections.github.stats.repos')).toBe('Depo')
  })

  it('returns the path string when the key does not exist', () => {
    expect(t('en', 'sections.nonexistent.key')).toBe('sections.nonexistent.key')
  })

  it('returns the path when the value is an object (not a string leaf)', () => {
    // 'sections.github' is an object — `t` should refuse to render it.
    expect(t('en', 'sections.github')).toBe('sections.github')
  })

  it('returns the path for an empty input', () => {
    expect(t('en', '')).toBe('')
  })
})
