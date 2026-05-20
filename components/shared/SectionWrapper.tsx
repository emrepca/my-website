'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  id: string
  label?: string
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export function SectionWrapper({
  id,
  label,
  title,
  subtitle,
  children,
  className,
  containerClassName,
}: SectionWrapperProps) {
  return (
    <section id={id} className={cn('section-padding relative scroll-mt-20', className)}>
      <div className={cn('mx-auto w-full max-w-6xl px-6 md:px-8', containerClassName)}>
        {(label || title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-12 md:mb-16"
          >
            {subtitle && (
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--accent)]">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                {title}
              </h2>
            )}
            {label && (
              <p className="mt-4 max-w-2xl text-base text-[color:var(--muted-foreground)] md:text-lg">
                {label}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
