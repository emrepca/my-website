/**
 * Unit tests for `lib/certificates.ts`.
 *
 * `getCertificateLabel` is pure (URL-in, label-out) so it's exhaustively tested.
 * `listCertificates` reads from disk; we only verify it returns a string[] and
 * each entry is a public certificate URL — its actual contents change as new
 * certificates are added and shouldn't drive tests.
 */
import { describe, expect, it } from 'vitest'
import { getCertificateLabel, listCertificates } from '@/lib/certificates'

describe('getCertificateLabel', () => {
  it('strips the .pdf extension', () => {
    expect(getCertificateLabel('/certificates/AWS_Foundations.pdf')).toBe('AWS Foundations')
  })

  it('replaces underscores with spaces', () => {
    expect(getCertificateLabel('/certificates/ISTQB_Foundation_Level.pdf')).toBe(
      'ISTQB Foundation Level',
    )
  })

  it('replaces dashes with spaces', () => {
    expect(getCertificateLabel('/certificates/Test-Automation-101.pdf')).toBe(
      'Test Automation 101',
    )
  })

  it('collapses runs of separators into a single space', () => {
    expect(getCertificateLabel('/certificates/A__B---C.pdf')).toBe('A B C')
  })

  it('handles a bare filename (no path prefix)', () => {
    expect(getCertificateLabel('Cypress.pdf')).toBe('Cypress')
  })

  it('is case-insensitive about the .pdf extension', () => {
    expect(getCertificateLabel('/certificates/X.PDF')).toBe('X')
  })

  it('returns the trimmed input when no extension is present', () => {
    expect(getCertificateLabel('/certificates/raw')).toBe('raw')
  })
})

describe('listCertificates', () => {
  it('returns an array of strings', () => {
    const list = listCertificates()
    expect(Array.isArray(list)).toBe(true)
    for (const item of list) {
      expect(item).toBeTypeOf('string')
    }
  })

  it('returns URLs under /certificates when any PDFs exist', () => {
    const list = listCertificates()
    for (const url of list) {
      expect(url.startsWith('/certificates/')).toBe(true)
      expect(url.toLowerCase().endsWith('.pdf')).toBe(true)
    }
  })

  it('never throws even when the directory is missing or empty', () => {
    expect(() => listCertificates()).not.toThrow()
  })
})
