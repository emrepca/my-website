import cvEn from '@/content/cv/cv-en.json'
import cvTr from '@/content/cv/cv-tr.json'
import type { CVData } from '@/types/cv'
import type { Locale } from '@/constants/config'

type EnRaw = typeof cvEn
type TrRaw = typeof cvTr

function adaptEN(raw: EnRaw): CVData {
  return {
    personalInfo: {
      fullName: raw.personal_information.full_name,
      title: raw.personal_information.title,
      phone: raw.personal_information.phone,
      email: raw.personal_information.email,
      languages: raw.personal_information.languages,
      dateOfBirth: raw.personal_information.date_of_birth,
      city: raw.personal_information.city,
      linkedin: raw.personal_information.linkedin,
      github: raw.personal_information.github,
      medium: raw.personal_information.medium,
    },
    professionalSummary: raw.professional_summary,
    education: raw.education.map((e) => ({
      institution: e.institution,
      degree: e.degree,
      years: e.years,
      grade: e.gpa,
    })),
    skills: {
      'Programming Languages': raw.skills.programming_languages,
      'Web Technologies': raw.skills.web_technologies,
      Databases: raw.skills.databases,
      'Cloud, DevOps & Deployment': raw.skills.cloud_devops_deployment,
      'Test & QA': raw.skills.test_and_qa,
      'Test Automation & Tools': raw.skills.test_automation_and_tools,
      'Systems & IT': raw.skills.systems_and_it,
    },
    workExperience: raw.work_experience.map((w) => ({
      company: w.company,
      role: w.role,
      date: w.date,
      responsibilities: w.responsibilities,
      technologies: 'technologies' in w ? (w as { technologies: string[] }).technologies : undefined,
    })),
    projects: raw.projects.map((p) => ({
      title: p.title,
      description: p.description,
      technologies: p.technologies,
      details: p.details,
    })),
    certifications: raw.certifications,
  }
}

function adaptTR(raw: TrRaw): CVData {
  return {
    personalInfo: {
      fullName: raw.kisisel_bilgiler.ad_soyad,
      title: raw.kisisel_bilgiler.unvan,
      phone: raw.kisisel_bilgiler.telefon,
      email: raw.kisisel_bilgiler.e_posta,
      languages: raw.kisisel_bilgiler.yabanci_diller,
      dateOfBirth: raw.kisisel_bilgiler.dogum_tarihi,
      city: raw.kisisel_bilgiler.sehir,
      linkedin: raw.kisisel_bilgiler.linkedin,
      github: raw.kisisel_bilgiler.github,
      medium: raw.kisisel_bilgiler.medium,
    },
    professionalSummary: raw.profesyonel_ozet,
    education: raw.egitim.map((e) => ({
      institution: e.kurum,
      degree: e.bolum,
      years: e.yillar,
      grade: e.gano,
    })),
    skills: {
      'Programlama Dilleri': raw.yetenekler.programlama_dilleri,
      'Web Teknolojileri': raw.yetenekler.web_teknolojileri,
      Veritabanı: raw.yetenekler.veritabani,
      'Cloud, DevOps & Dağıtım': raw.yetenekler.cloud_devops_dagitim,
      'Test & QA': raw.yetenekler.test_ve_qa,
      'Test Otomasyonu & Araçları': raw.yetenekler.test_otomasyonu_ve_araclari,
      'Sistem & BT': raw.yetenekler.sistem_ve_bt,
    },
    workExperience: raw.is_deneyimi.map((w) => ({
      company: w.sirket,
      role: w.unvan,
      date: w.tarih,
      responsibilities: w.sorumluluklar,
      technologies: 'teknolojiler' in w ? (w as { teknolojiler: string[] }).teknolojiler : undefined,
    })),
    projects: raw.projeler.map((p) => ({
      title: p.baslik,
      description: p.tanim,
      technologies: p.teknolojiler,
      details: p.detaylar,
    })),
    certifications: raw.sertifikalar,
  }
}

export function loadCV(lang: Locale): CVData {
  if (lang === 'tr') return adaptTR(cvTr)
  return adaptEN(cvEn)
}
