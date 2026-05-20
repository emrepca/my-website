import type { MetadataRoute } from 'next'
import { LOCALES, SITE_CONFIG } from '@/constants/config'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return LOCALES.map((lang) => ({
    url: `${SITE_CONFIG.url}/${lang}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: lang === 'en' ? 1 : 0.8,
  }))
}
