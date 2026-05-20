import fs from 'fs'
import path from 'path'
import certIndex from '@/content/certificates/index.json'
import type { CertificatesIndex } from '@/types/cv'

const CERT_DIR = path.join(process.cwd(), 'public', 'certificates')

export function listCertificates(): string[] {
  let files: string[] = []
  try {
    files = fs
      .readdirSync(CERT_DIR)
      .filter((f) => f.toLowerCase().endsWith('.pdf'))
  } catch {
    files = []
  }

  const order = (certIndex as CertificatesIndex).order ?? []
  const ordered: string[] = []
  const seen = new Set<string>()

  for (const name of order) {
    if (files.includes(name)) {
      ordered.push(name)
      seen.add(name)
    }
  }
  for (const f of files) {
    if (!seen.has(f)) ordered.push(f)
  }

  return ordered.map((f) => `/certificates/${f}`)
}

export function getCertificateLabel(url: string): string {
  const name = url.split('/').pop() ?? url
  return name
    .replace(/\.pdf$/i, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
