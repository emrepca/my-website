'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink, FolderKanban } from 'lucide-react'
import Image from 'next/image'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'
import type { ProjectShowcase } from '@/types/cv'

interface ProjectsProps {
  lang: Locale
  projects: ProjectShowcase[]
}

export function Projects({ lang, projects }: ProjectsProps) {
  return (
    <SectionWrapper
      id="projects"
      subtitle={t(lang, 'sections.projects.subtitle')}
      title={t(lang, 'sections.projects.title')}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--accent)]/40 hover:shadow-[0_0_50px_-15px_var(--accent)]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[color:var(--muted)]/30">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center">
                  <div className="hero-grid absolute inset-0 opacity-40" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)]/60 backdrop-blur">
                    <FolderKanban className="h-8 w-8 text-[color:var(--accent)]" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-6">
              <div className="mb-3 flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[color:var(--border)] bg-[color:var(--muted)]/40 px-2.5 py-0.5 text-[11px] font-medium text-[color:var(--muted-foreground)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <h3 className="text-lg font-bold text-foreground md:text-xl">{project.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-foreground)]">
                {project.description}
              </p>

              {(project.problem || project.solution || project.result) && (
                <div className="mt-4 space-y-2 border-t border-[color:var(--border)] pt-4">
                  {project.problem && (
                    <CaseStudyRow
                      label={t(lang, 'sections.projects.problem')}
                      text={project.problem}
                    />
                  )}
                  {project.solution && (
                    <CaseStudyRow
                      label={t(lang, 'sections.projects.solution')}
                      text={project.solution}
                    />
                  )}
                  {project.result && (
                    <CaseStudyRow
                      label={t(lang, 'sections.projects.result')}
                      text={project.result}
                    />
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center gap-2 pt-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border)] bg-[color:var(--muted)]/30 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-[color:var(--muted)]"
                  >
                    <Github className="h-3.5 w-3.5" />
                    {t(lang, 'sections.projects.viewCode')}
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--accent)] px-3 py-1.5 text-xs font-semibold text-[color:var(--accent-foreground)] transition-colors hover:bg-[color:var(--accent-hover)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t(lang, 'sections.projects.viewLive')}
                  </a>
                )}
                {!project.github_url && !project.demo_url && (
                  <span className="inline-flex items-center gap-1 text-xs text-[color:var(--muted-foreground)]">
                    <ArrowUpRight className="h-3 w-3" />
                    {project.technologies.length} {lang === 'tr' ? 'teknoloji' : 'technologies'}
                  </span>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </SectionWrapper>
  )
}

function CaseStudyRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-3 text-xs">
      <span className="w-16 flex-shrink-0 font-semibold uppercase tracking-wider text-[color:var(--accent)]">
        {label}
      </span>
      <span className="text-[color:var(--muted-foreground)]">{text}</span>
    </div>
  )
}
