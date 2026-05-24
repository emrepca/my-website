/**
 * Component tests for `components/github/LanguageBreakdown.tsx`.
 *
 * Covers:
 *   - Empty-state copy (en & tr) when no languages are passed
 *   - One legend row per language with its name and percentage
 *   - Section title is the localized string from `sections.github.languages.title`
 */
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { LanguageBreakdown } from '@/components/github/LanguageBreakdown'
import { t } from '@/lib/i18n'
import { renderWithLang } from '../setup/test-utils'
import type { LanguageStat } from '@/types/github'

const sample: LanguageStat[] = [
  { name: 'TypeScript', count: 5, percent: 50, color: '#3178c6' },
  { name: 'Python', count: 3, percent: 30, color: '#3572a5' },
  { name: 'Go', count: 2, percent: 20, color: '#00add8' },
]

describe('LanguageBreakdown', () => {
  it.each(['en', 'tr'] as const)('renders the localized empty state in %s', (lang) => {
    renderWithLang(<LanguageBreakdown lang={lang} languages={[]} />, { lang })
    expect(screen.getByText(t(lang, 'sections.github.languages.empty'))).toBeInTheDocument()
  })

  it('renders the section title from the dictionary', () => {
    renderWithLang(<LanguageBreakdown lang="en" languages={sample} />, { lang: 'en' })
    expect(
      screen.getByRole('heading', { name: t('en', 'sections.github.languages.title') }),
    ).toBeInTheDocument()
  })

  it('renders one legend row per language with name and percentage', () => {
    renderWithLang(<LanguageBreakdown lang="en" languages={sample} />, { lang: 'en' })
    for (const language of sample) {
      expect(screen.getByText(language.name)).toBeInTheDocument()
      expect(screen.getByText(`${language.percent}%`)).toBeInTheDocument()
    }
  })

  it('does NOT render the legend list when languages are empty', () => {
    renderWithLang(<LanguageBreakdown lang="en" languages={[]} />, { lang: 'en' })
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })
})
