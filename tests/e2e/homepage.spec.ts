/**
 * E2E: the root URL redirects to the default locale, and every section anchor
 * is reachable on the resulting page.
 *
 * We mock /api/github so the run is hermetic — no real GitHub API hit during
 * CI.
 */
import { test, expect } from '@playwright/test'
import { githubPayload } from './fixtures/github-payload'
import { seedDesign } from './fixtures/design'

test.beforeEach(async ({ page }) => {
  await seedDesign(page)
  await page.route('**/api/github', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(githubPayload),
    }),
  )
})

test('GET / redirects to the default locale', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.url()).toContain('/en')
  expect(page.url()).toMatch(/\/en\/?$/)
})

test('every section anchor is present on the homepage', async ({ page }) => {
  await page.goto('/en')
  for (const id of [
    'about',
    'experience',
    'projects',
    'github',
    'tech-stack',
    'education',
    'certificates',
    'contact',
  ]) {
    await expect(page.locator(`#${id}`)).toBeAttached()
  }
})

test('homepage exposes an <html lang> attribute', async ({ page }) => {
  await page.goto('/en')
  // The root layout currently hardcodes lang="en" — see locale-switch.spec.ts
  // for the follow-up around making this locale-aware.
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})
