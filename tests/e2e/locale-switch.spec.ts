/**
 * E2E: each supported locale renders its own translated nav labels.
 *
 * The test asserts on the most stable strings on the page — the top-level
 * nav — so a copy tweak to a section body won't break it.
 */
import { test, expect } from '@playwright/test'
import { githubPayload } from './fixtures/github-payload'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/github', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(githubPayload),
    }),
  )
})

test('/en renders English nav labels', async ({ page }) => {
  const response = await page.goto('/en')
  expect(response?.status()).toBe(200)

  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'About' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Experience' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible()
})

test('/tr renders Turkish nav labels', async ({ page }) => {
  const response = await page.goto('/tr')
  expect(response?.status()).toBe(200)

  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Hakkımda' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Deneyim' })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Projeler' })).toBeVisible()
})

/**
 * Known finding: the root <html lang> attribute is hardcoded to "en" in
 * `app/layout.tsx`, so /tr renders with lang="en". This is an accessibility
 * (screen-reader pronunciation) and SEO regression — captured here so it
 * doesn't get lost. A fix requires moving the <html> element into
 * `app/[lang]/layout.tsx` (which can read the locale param), and that's a
 * larger refactor than this test suite owns.
 */
test.skip('TODO: /tr should expose lang="tr" on the <html> element', async ({ page }) => {
  await page.goto('/tr')
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
})
