/**
 * E2E: the design picker.
 *
 * Covers the three things that make it more than a styled dialog — it only
 * greets first-time visitors, the choice survives a reload, and picking
 * neobrutalism reskins the page without touching its content.
 */
import { test, expect } from '@playwright/test'
import { githubPayload } from './fixtures/github-payload'
import { DESIGN_STORAGE_KEY, seedDesign } from './fixtures/design'

test.beforeEach(async ({ page }) => {
  await page.route('**/api/github', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(githubPayload),
    }),
  )
})

const dialog = (page: import('@playwright/test').Page) =>
  page.getByRole('dialog', { name: 'Choose your design' })

test('a first-time visitor is asked to choose a design', async ({ page }) => {
  await page.goto('/en')
  await expect(dialog(page)).toBeVisible()
  await expect(page.getByRole('button', { name: /Current Design/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /Neobrutalism/ })).toBeVisible()
})

test('ESC does not dismiss the picker before a choice is made', async ({ page }) => {
  await page.goto('/en')
  await expect(dialog(page)).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(dialog(page)).toBeVisible()

  // …but it does once a skin has been chosen.
  await page.getByRole('button', { name: /Current Design/ }).click()
  await expect(dialog(page)).toBeHidden()

  await page.getByRole('button', { name: 'Change Theme' }).first().click()
  await expect(dialog(page)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog(page)).toBeHidden()
})

test('choosing neobrutalism reskins the page and persists across reloads', async ({ page }) => {
  await page.goto('/en')
  await expect(page.locator('html')).toHaveAttribute('data-design', 'default')

  await page.getByRole('button', { name: /Neobrutalism/ }).click()

  await expect(dialog(page)).toBeHidden()
  await expect(page.locator('html')).toHaveAttribute('data-design', 'neobrutalism')
  expect(
    await page.evaluate((key) => window.localStorage.getItem(key), DESIGN_STORAGE_KEY),
  ).toBe('neobrutalism')

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-design', 'neobrutalism')
  await expect(dialog(page)).toBeHidden()
})

test('the skin is visual only — the page keeps its content and anchors', async ({ page }) => {
  await seedDesign(page, 'neobrutalism')
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

  const nav = page.getByRole('navigation', { name: 'Primary' })
  await expect(nav.getByRole('link', { name: 'Projects' })).toBeVisible()
})

test('a returning visitor is not interrupted', async ({ page }) => {
  await seedDesign(page, 'default')
  await page.goto('/en')
  await expect(page.locator('#about')).toBeAttached()
  await expect(dialog(page)).toBeHidden()
})
