'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  DEFAULT_DESIGN,
  DESIGN_ATTRIBUTE,
  DESIGN_STORAGE_KEY,
  isDesign,
  type Design,
} from '@/constants/design'

interface DesignContextValue {
  /** Active skin. `default` until the client has read localStorage. */
  design: Design
  /** Applies a skin instantly and persists it. */
  setDesign: (design: Design) => void
  /** False until the visitor has picked a skin at least once. */
  hasChosen: boolean
  /** True once the client effect has run — guards against hydration mismatch. */
  mounted: boolean
  chooserOpen: boolean
  openChooser: () => void
  closeChooser: () => void
}

const DesignContext = createContext<DesignContextValue | null>(null)

function readStoredDesign(): Design | null {
  try {
    const stored = window.localStorage.getItem(DESIGN_STORAGE_KEY)
    return isDesign(stored) ? stored : null
  } catch {
    // Private mode / storage disabled — treat as "never chosen".
    return null
  }
}

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [design, setDesignState] = useState<Design>(DEFAULT_DESIGN)
  const [hasChosen, setHasChosen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [chooserOpen, setChooserOpen] = useState(false)

  // Sync React state with what the blocking <head> script already applied.
  useEffect(() => {
    const stored = readStoredDesign()

    // Re-assert the attribute rather than trusting the <head> script to have
    // the last word. A hydration mismatch anywhere on the page makes React
    // re-render the tree from the server markup, which resets <html> to the
    // attributes the server sent — silently dropping the skin. (The site has
    // one such mismatch today under `prefers-reduced-motion`.) Writing it here
    // costs nothing and makes the skin survive that recovery.
    document.documentElement.setAttribute(DESIGN_ATTRIBUTE, stored ?? DEFAULT_DESIGN)

    if (stored) {
      setDesignState(stored)
      setHasChosen(true)
    } else {
      // First visit: ask before anything else on the page can be interacted with.
      setChooserOpen(true)
    }
    setMounted(true)
  }, [])

  const setDesign = useCallback((next: Design) => {
    document.documentElement.setAttribute(DESIGN_ATTRIBUTE, next)
    setDesignState(next)
    setHasChosen(true)
    try {
      window.localStorage.setItem(DESIGN_STORAGE_KEY, next)
    } catch {
      // Choice still applies for this session even if it can't be persisted.
    }
  }, [])

  const openChooser = useCallback(() => setChooserOpen(true), [])
  const closeChooser = useCallback(() => setChooserOpen(false), [])

  const value = useMemo<DesignContextValue>(
    () => ({
      design,
      setDesign,
      hasChosen,
      mounted,
      chooserOpen,
      openChooser,
      closeChooser,
    }),
    [design, setDesign, hasChosen, mounted, chooserOpen, openChooser, closeChooser],
  )

  return <DesignContext.Provider value={value}>{children}</DesignContext.Provider>
}

export function useDesign(): DesignContextValue {
  const ctx = useContext(DesignContext)
  if (!ctx) throw new Error('useDesign must be used inside <DesignProvider>')
  return ctx
}
