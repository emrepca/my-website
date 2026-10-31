import Image from 'next/image'
import { notFound } from 'next/navigation'
import projectsJson from '@/content/projects/projects.json'
import { LOCALES, type Locale } from '@/constants/config'
import { loadCV } from '@/lib/cv'
import { listCertificates } from '@/lib/certificates'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Experience } from '@/components/sections/Experience'
import { Projects } from '@/components/sections/Projects'
import { GithubActivity } from '@/components/sections/GithubActivity'
import { TechStack } from '@/components/sections/TechStack'
import { Education } from '@/components/sections/Education'
import { Certificates } from '@/components/sections/Certificates'
import { Contact } from '@/components/sections/Contact'
import type { ProjectShowcase } from '@/types/cv'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function LocalizedPage({ params }: PageProps) {
  const { lang: raw } = await params
  if (!LOCALES.includes(raw as Locale)) notFound()
  const lang = raw as Locale

  const cv = loadCV(lang)
  const projects = projectsJson as ProjectShowcase[]
  const certificates = listCertificates()

  return (
    <div lang={lang}>
      {/* Same orange field as the hero, pinned behind every section */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20">
        <Image
          src="/hero/hero_orange_background.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5a1f04]/50 via-transparent to-transparent" />
      </div>
      <Navbar lang={lang} />
      <main>
        <Hero lang={lang} cv={cv} />
        <About lang={lang} cv={cv} />
        <Experience lang={lang} cv={cv} />
        <Projects lang={lang} projects={projects} />
        <GithubActivity lang={lang} />
        <TechStack lang={lang} cv={cv} />
        <Education lang={lang} cv={cv} />
        <Certificates lang={lang} certificates={certificates} />
        <Contact lang={lang} cv={cv} />
      </main>
      <Footer lang={lang} cv={cv} />
    </div>
  )
}
