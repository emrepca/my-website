import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LOCALES, SITE_CONFIG, type Locale } from '@/constants/config'
import { loadCV } from '@/lib/cv'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!LOCALES.includes(lang as Locale)) return {}

  const cv = loadCV(lang as Locale)
  const description =
    lang === 'tr'
      ? `${cv.personalInfo.title} · Kişisel portföy. Projeler, deneyim, yetenekler ve sertifikalar.`
      : `${cv.personalInfo.title} · Personal portfolio. Projects, experience, skills and certifications.`

  return {
    title: `${cv.personalInfo.fullName} — ${cv.personalInfo.title}`,
    description,
    openGraph: {
      title: `${cv.personalInfo.fullName} — ${cv.personalInfo.title}`,
      description,
      url: `${SITE_CONFIG.url}/${lang}`,
      siteName: SITE_CONFIG.shortName,
      locale: lang === 'tr' ? 'tr_TR' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cv.personalInfo.fullName} — ${cv.personalInfo.title}`,
      description,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/${lang}`,
      languages: {
        en: `${SITE_CONFIG.url}/en`,
        tr: `${SITE_CONFIG.url}/tr`,
      },
    },
  }
}

export default async function LangLayout({ children, params }: LayoutProps) {
  const { lang } = await params
  if (!LOCALES.includes(lang as Locale)) notFound()
  return <>{children}</>
}
