import type { Locale } from '@/constants/config'

/** A string provided in every supported locale. */
export type LocalizedText = Record<Locale, string>

export interface PersonalInfo {
  fullName: string
  title: string
  phone: string
  email: string
  languages: string
  dateOfBirth: string
  city: string
  linkedin: string
  github: string
  medium: string
}

export interface EducationItem {
  institution: string
  degree: string
  years: string
  grade?: string
}

export interface WorkExperienceItem {
  company: string
  role: string
  date: string
  responsibilities: string[]
  technologies?: string[]
}

export interface CVProject {
  title: string
  description: string
  technologies: string[]
  details: string
}

export interface CVData {
  personalInfo: PersonalInfo
  professionalSummary: string
  education: EducationItem[]
  skills: Record<string, string[]>
  workExperience: WorkExperienceItem[]
  projects: CVProject[]
  certifications: string[]
}

export interface ProjectShowcase {
  id: string
  title: string
  description: LocalizedText
  technologies: string[]
  problem?: string
  solution?: string
  result?: string
  github_url?: string
  demo_url?: string
  image?: string
}

export interface CertificatesIndex {
  order: string[]
}
