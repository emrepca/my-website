/**
 * Design-picker helpers for E2E specs.
 *
 * The picker opens automatically for anyone who has never chosen a skin, and a
 * fresh Playwright context is always a first-time visitor. Specs that are about
 * something else seed a choice up front so they run as a returning visitor and
 * the modal never sits between them and the page.
 */
import type { Page } from '@playwright/test'

export const DESIGN_STORAGE_KEY = 'portfolio-design'

export type DesignName = 'default' | 'neobrutalism'

/** Runs before any page script, so the choice is in place at first paint. */
export async function seedDesign(page: Page, design: DesignName = 'default') {
  await page.addInitScript(
    ([key, value]) => {
      try {
        window.localStorage.setItem(key, value)
      } catch {
        /* storage disabled — the spec that needs this will fail loudly */
      }
    },
    [DESIGN_STORAGE_KEY, design] as const,
  )
}
