/**
 * E2E: the Developer Activity section consumes /api/github correctly.
 *
 * Network is mocked, so this test proves the *end-to-end wiring* between the
 * API endpoint and the visible dashboard — without ever calling GitHub.
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

test('stat cards render with values from the fixture', async ({ page }) => {
  await page.goto('/en#github')
  const section = page.locator('#github')
  await expect(section).toBeVisible()
  await expect(section.getByText('Repositories', { exact: true })).toBeVisible()
  await expect(section.getByText('TypeScript', { exact: true }).first()).toBeVisible()
})

test('language breakdown lists each language from the fixture', async ({ page }) => {
  await page.goto('/en#github')
  const section = page.locator('#github')
  for (const language of githubPayload.languages) {
    await expect(
      section.getByText(language.name, { exact: true }).first(),
    ).toBeVisible()
  }
})

test('activity feed shows the latest event title', async ({ page }) => {
  await page.goto('/en#github')
  const section = page.locator('#github')
  await expect(section.getByText(/Pushed 3 commits to/i)).toBeVisible()
  await expect(section.getByText('feat: add tests')).toBeVisible()
})

test('graceful error UI is shown when the API errors out', async ({ page }) => {
  await page.unroute('**/api/github')
  await page.route('**/api/github', (route) =>
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false }),
    }),
  )
  await page.goto('/en#github')
  const section = page.locator('#github')
  await expect(section.getByText(/unavailable/i)).toBeVisible()
})
