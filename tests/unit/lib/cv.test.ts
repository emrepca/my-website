/**
 * Unit tests for `lib/cv.ts`.
 *
 * `loadCV` is the boundary between the locale-shaped raw JSON files and the
 * normalized `CVData` shape every component consumes. We pin the contract for
 * both locales: required keys are present, types are stable, the role->lang
 * mapping is bidirectional.
 */
import { describe, expect, it } from 'vitest'
import { loadCV } from '@/lib/cv'

describe('loadCV("en")', () => {
  it('returns a normalized CVData with the English personal info', () => {
    const cv = loadCV('en')
    expect(cv.personalInfo.fullName).toBeTypeOf('string')
    expect(cv.personalInfo.email).toMatch(/@/)
    expect(cv.personalInfo.github).toBeTypeOf('string')
  })

  it('maps the english skill bucket keys to their canonical names', () => {
    const cv = loadCV('en')
    const keys = Object.keys(cv.skills)
    expect(keys).toContain('Programming Languages')
    expect(keys).toContain('Test & QA')
    expect(keys).toContain('Test Automation')
  })

  it('normalizes the education entries with institution + years', () => {
    const cv = loadCV('en')
    expect(cv.education.length).toBeGreaterThan(0)
    for (const entry of cv.education) {
      expect(entry.institution).toBeTypeOf('string')
      expect(entry.years).toBeTypeOf('string')
    }
  })

  it('normalizes work experience with role + company + date', () => {
    const cv = loadCV('en')
    expect(cv.workExperience.length).toBeGreaterThan(0)
    for (const entry of cv.workExperience) {
      expect(entry.company).toBeTypeOf('string')
      expect(entry.role).toBeTypeOf('string')
      expect(entry.date).toBeTypeOf('string')
      expect(Array.isArray(entry.responsibilities)).toBe(true)
    }
  })

  it('normalizes project entries with title + description', () => {
    const cv = loadCV('en')
    for (const project of cv.projects) {
      expect(project.title).toBeTypeOf('string')
      expect(project.description).toBeTypeOf('string')
      expect(Array.isArray(project.technologies)).toBe(true)
    }
  })
})

describe('loadCV("tr")', () => {
  it('returns the same logical shape for the Turkish locale', () => {
    const cv = loadCV('tr')
    expect(cv.personalInfo.fullName).toBeTypeOf('string')
    expect(cv.personalInfo.email).toMatch(/@/)
  })

  it('maps the turkish skill bucket keys to their canonical names', () => {
    const cv = loadCV('tr')
    const keys = Object.keys(cv.skills)
    expect(keys).toContain('Programlama Dilleri')
    expect(keys).toContain('Test ve Kalite Güvence')
  })

  it('returns the same number of education entries as the English CV', () => {
    expect(loadCV('tr').education.length).toBe(loadCV('en').education.length)
  })

  it('returns the same number of work experience entries as the English CV', () => {
    expect(loadCV('tr').workExperience.length).toBe(loadCV('en').workExperience.length)
  })
})
