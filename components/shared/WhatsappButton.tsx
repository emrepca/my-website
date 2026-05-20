'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { t } from '@/lib/i18n'
import type { Locale } from '@/constants/config'

/** Digits-only international number for the wa.me deep link (no '+', no spaces). */
const WHATSAPP_NUMBER = '905414884253'

/** Official WhatsApp glyph (Simple Icons, 24×24 viewBox). */
function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488" />
    </svg>
  )
}

interface WhatsappButtonProps {
  lang: Locale
}

export function WhatsappButton({ lang }: WhatsappButtonProps) {
  const reduceMotion = useReducedMotion()

  const label = t(lang, 'whatsapp.label')
  const message = t(lang, 'whatsapp.message')
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  // Drives the entrance, hover scale and press feedback of the whole button.
  const buttonVariants: Variants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.4, y: reduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: reduceMotion
        ? { duration: 0.3, delay: 0.4 }
        : { type: 'spring', stiffness: 260, damping: 18, delay: 0.6 },
    },
    hover: { scale: reduceMotion ? 1 : 1.08 },
    tap: { scale: reduceMotion ? 1 : 0.9 },
  }

  // The soft glow inherits the parent's variant label and brightens on hover.
  const glowVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
    hover: { opacity: 1, scale: 1.15 },
    tap: { opacity: 0.8 },
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      variants={buttonVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="group fixed z-40 flex h-[52px] w-[52px] items-center justify-center rounded-full outline-none md:h-14 md:w-14
        bottom-[calc(env(safe-area-inset-bottom,0px)_+_1.5rem)]
        right-[calc(env(safe-area-inset-right,0px)_+_1.5rem)]
        md:bottom-[calc(env(safe-area-inset-bottom,0px)_+_2rem)]
        md:right-[calc(env(safe-area-inset-right,0px)_+_2rem)]
        focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]"
    >
      {/* Soft outer glow — intensifies on hover */}
      <motion.span
        aria-hidden
        variants={glowVariants}
        className="pointer-events-none absolute -inset-2.5 rounded-full bg-[#25d366] blur-xl"
      />

      {/* Idle pulse ring — subtle, expands every few seconds */}
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[#25d366]"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0.4, 0], scale: [1, 1.7] }}
          transition={{ duration: 2.2, ease: 'easeOut', repeat: Infinity, repeatDelay: 2.4 }}
        />
      )}

      {/* Green surface — glassmorphic border + soft shadow */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/15 ring-1 ring-inset ring-white/25
          bg-[linear-gradient(145deg,#2ee06e_0%,#23c862_45%,#12a04c_100%)]
          shadow-[0_10px_30px_-6px_rgba(18,140,80,0.6),0_4px_12px_-4px_rgba(0,0,0,0.45)]"
      />

      {/* Glass top highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/35 via-white/5 to-transparent"
      />

      <WhatsappGlyph className="relative h-[26px] w-[26px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] md:h-7 md:w-7" />

      {/* Tooltip — desktop only, theme-aware */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-full mr-3 hidden translate-x-1 whitespace-nowrap rounded-xl
          border border-[color:var(--border)] bg-[color:var(--card)]/90 px-3 py-1.5 text-xs font-medium text-foreground
          opacity-0 shadow-lg backdrop-blur-md transition-all duration-200
          group-hover:translate-x-0 group-hover:opacity-100 md:block"
      >
        {label}
      </span>
    </motion.a>
  )
}
