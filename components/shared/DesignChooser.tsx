'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { DESIGNS, type Design } from '@/constants/design'
import { useDesign } from '@/components/shared/DesignProvider'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'

interface DesignChooserProps {
  lang: Locale
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * First-visit design picker.
 *
 * Rendered once per page (from the locale layout) and portalled to <body> so it
 * always sits above the fixed navbar, the floating WhatsApp button and the
 * certificate lightbox.
 *
 * Dismissal is gated on having made a choice: on the very first visit there is
 * no close button, backdrop clicks are inert and ESC is swallowed. Once a skin
 * is stored, the same dialog reopens from the "Change Theme" control and
 * behaves like a normal, fully dismissible modal.
 */
export function DesignChooser({ lang }: DesignChooserProps) {
  const { design, setDesign, hasChosen, chooserOpen, closeChooser } = useDesign()
  const panelRef = useRef<HTMLDivElement>(null)
  const [portalReady, setPortalReady] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => setPortalReady(true), [])

  const dismissible = hasChosen

  const handleSelect = useCallback(
    (next: Design) => {
      setDesign(next)
      closeChooser()
    },
    [setDesign, closeChooser],
  )

  // Focus management: move focus into the dialog, trap Tab inside it, and hand
  // focus back to whatever opened it on close.
  useEffect(() => {
    if (!chooserOpen) return

    const opener = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    const focusables = () =>
      panel ? Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)) : []

    focusables()[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (dismissible) closeChooser()
        return
      }
      if (event.key !== 'Tab') return

      const items = focusables()
      if (items.length === 0) return

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (!panel?.contains(active)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus?.()
    }
  }, [chooserOpen, dismissible, closeChooser])

  // Lock background scrolling while the dialog owns the screen.
  useEffect(() => {
    if (!chooserOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [chooserOpen])

  if (!portalReady) return null

  const overlay = (
    <AnimatePresence>
      {chooserOpen && (
        <motion.div
          className="dsw-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2, ease: 'easeOut' }}
          onClick={dismissible ? closeChooser : undefined}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dsw-title"
            aria-describedby="dsw-description"
            className="dsw-panel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{
              duration: reduceMotion ? 0 : 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {dismissible && (
              <button
                type="button"
                onClick={closeChooser}
                className="dsw-close"
                aria-label={t(lang, 'design.close')}
              >
                <X className="dsw-close__icon" aria-hidden="true" />
              </button>
            )}

            <p className="dsw-eyebrow">{t(lang, 'design.eyebrow')}</p>
            <h2 id="dsw-title" className="dsw-title">
              {t(lang, 'design.title')}
            </h2>
            <p id="dsw-description" className="dsw-description">
              {t(lang, 'design.description')}
            </p>

            <div className="dsw-options">
              {DESIGNS.map((option) => (
                <DesignOption
                  key={option}
                  option={option}
                  lang={lang}
                  active={hasChosen && design === option}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            <p className="dsw-footnote">{t(lang, 'design.footnote')}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(overlay, document.body)
}

function DesignOption({
  option,
  lang,
  active,
  onSelect,
}: {
  option: Design
  lang: Locale
  active: boolean
  onSelect: (design: Design) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      aria-pressed={active}
      className="dsw-option"
      data-option={option}
      data-active={active ? 'true' : undefined}
    >
      <DesignPreview option={option} />

      <span className="dsw-option__meta">
        <span className="dsw-option__heading">
          <span className="dsw-option__name">{t(lang, `design.${option}.name`)}</span>
          {active && (
            <span className="dsw-option__badge">
              <Check className="dsw-option__badge-icon" aria-hidden="true" />
              {t(lang, 'design.active')}
            </span>
          )}
        </span>
        <span className="dsw-option__blurb">{t(lang, `design.${option}.blurb`)}</span>
        <span className="dsw-option__cta">{t(lang, 'design.use')}</span>
      </span>
    </button>
  )
}

/**
 * Miniature of the site rendered in the option's own style.
 *
 * Hard-coded colours on purpose: each preview must keep showing its own skin no
 * matter which skin is currently active.
 */
function DesignPreview({ option }: { option: Design }) {
  return (
    <span className="dsw-mock" data-mock={option} aria-hidden="true">
      <span className="dsw-mock__nav">
        <span className="dsw-mock__logo" />
        <span className="dsw-mock__links">
          <i />
          <i />
          <i />
        </span>
      </span>
      <span className="dsw-mock__body">
        <span className="dsw-mock__h1" />
        <span className="dsw-mock__h1 dsw-mock__h1--short" />
        <span className="dsw-mock__text" />
        <span className="dsw-mock__text dsw-mock__text--short" />
        <span className="dsw-mock__btn" />
        <span className="dsw-mock__cards">
          <i />
          <i />
        </span>
      </span>
    </span>
  )
}
