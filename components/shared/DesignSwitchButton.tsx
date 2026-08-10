'use client'

import { Palette } from 'lucide-react'
import { useDesign } from '@/components/shared/DesignProvider'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'

interface DesignSwitchButtonProps {
  lang: Locale
  /** `icon` sits in the navbar next to the other controls; `link` in the footer. */
  variant?: 'icon' | 'link'
}

/**
 * Reopens the design picker.
 *
 * Uses the same utility classes as its neighbouring controls so both skins
 * restyle it automatically — no design-specific branching here.
 */
export function DesignSwitchButton({ lang, variant = 'icon' }: DesignSwitchButtonProps) {
  const { openChooser } = useDesign()
  const label = t(lang, 'design.change')

  if (variant === 'link') {
    return (
      <button
        type="button"
        onClick={openChooser}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--muted-foreground)] transition-colors hover:text-foreground"
      >
        <Palette className="h-3.5 w-3.5" />
        {label}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={openChooser}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--card)]/40 text-foreground transition-colors hover:bg-[color:var(--muted)]"
    >
      <Palette className="h-4 w-4" />
    </button>
  )
}
