export const SITE_CONFIG = {
  name: 'Muhammet Emre Paça',
  shortName: 'Emre Paça',
  url: 'https://emrepaca.dev',
  ogImage: '/og-image.png',
  twitterHandle: '@emrepaca',
} as const

export const LOCALES = ['en', 'tr'] as const
export const DEFAULT_LOCALE = 'en'

export type Locale = (typeof LOCALES)[number]

export const NAV_ITEMS = [
  { id: 'about', key: 'nav.about' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'tech-stack', key: 'nav.skills' },
  { id: 'education', key: 'nav.education' },
  { id: 'certificates', key: 'nav.certifications' },
  { id: 'contact', key: 'nav.contact' },
] as const
