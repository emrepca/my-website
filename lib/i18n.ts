import uiEn from '@/translations/ui-en.json'
import uiTr from '@/translations/ui-tr.json'
import type { Locale } from '@/constants/config'

type Dict = typeof uiEn

const DICTS: Record<Locale, Dict> = {
  en: uiEn,
  tr: uiTr as Dict,
}

export function getDict(lang: Locale): Dict {
  return DICTS[lang] ?? DICTS.en
}

export function t(lang: Locale, path: string): string {
  const dict = getDict(lang)
  const parts = path.split('.')
  let cur: unknown = dict
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p]
    } else {
      return path
    }
  }
  return typeof cur === 'string' ? cur : path
}
