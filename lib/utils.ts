import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from '@/constants/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Replaces `{key}` placeholders in a translation string with given values. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_match, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  )
}

/** Locale-aware relative time, e.g. "3 days ago" / "3 gün önce". */
export function relativeTime(iso: string, lang: Locale): string {
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' })
  const seconds = Math.round((Date.now() - new Date(iso).getTime()) / 1000)

  if (Math.abs(seconds) < 60) return rtf.format(-seconds, 'second')
  const minutes = Math.round(seconds / 60)
  if (Math.abs(minutes) < 60) return rtf.format(-minutes, 'minute')
  const hours = Math.round(minutes / 60)
  if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return rtf.format(-days, 'day')
  const months = Math.round(days / 30)
  if (Math.abs(months) < 12) return rtf.format(-months, 'month')
  return rtf.format(-Math.round(months / 12), 'year')
}
