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
      degree: 'degree' in e ? (e.degree as string) : (e as { track: string }).track,
      years: e.years,
      grade: 'gpa' in e ? (e.gpa as string) : 'grade' in e ? (e.grade as string) : undefined,
    })),
    skills: {
      'Programming Languages': raw.skills.programming_languages,
      'Web Technologies': raw.skills.web_technologies,
      'Test & QA': raw.skills.test_and_qa,
      'Test Automation': raw.skills.test_automation,
      'API Testing': raw.skills.api_testing,
      Databases: raw.skills.databases,
      'Cloud & Version Control': raw.skills.cloud_and_version_control,
      'Operating Systems': raw.skills.operating_systems,
      'Test Management Tools': raw.skills.test_management_tools,
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
      degree: 'bolum' in e ? (e.bolum as string) : (e as { alan: string }).alan,
      years: e.yillar,
      grade:
        'gano' in e ? (e.gano as string) : 'diploma_notu' in e ? (e.diploma_notu as string) : undefined,
    })),
    skills: {
      'Programlama Dilleri': raw.yetenekler.programlama_dilleri,
      'Web Teknolojileri': raw.yetenekler.web_teknolojileri,
      'Test ve Kalite Güvence': raw.yetenekler.test_ve_kalite_guvence,
      'Test Otomasyonu': raw.yetenekler.test_otomasyonu,
      'API Testi': raw.yetenekler.api_testi,
      'Veri Tabanları': raw.yetenekler.veri_tabanlari,
      'Bulut ve Versiyon Kontrolü': raw.yetenekler.bulut_ve_versiyon_kontrolu,
      'İşletim Sistemleri': raw.yetenekler.isletim_sistemleri,
      'Test Yönetim Araçları': raw.yetenekler.test_yonetim_araclari,
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
