'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface CountUpOptions {
  duration?: number
  start?: boolean
}

/**
 * Animates a number from 0 to `target` with an ease-out curve once `start`
 * becomes true. Respects the user's reduced-motion preference by jumping
 * straight to the final value.
 */
export function useCountUp(
  target: number,
  { duration = 1500, start = true }: CountUpOptions = {},
): number {
  const [value, setValue] = useState(0)
  const reducedMotion = useReducedMotion()
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!start) return

    if (reducedMotion || duration <= 0) {
      setValue(target)
      return
    }

    let startTimestamp: number | null = null
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (timestamp: number) => {
      if (startTimestamp === null) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setValue(target * easeOut(progress))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration, start, reducedMotion])

  return value
}
