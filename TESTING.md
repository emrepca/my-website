# Testing strategy

This repository ships with a layered test suite covering unit, component,
integration, and end-to-end concerns. The goal is to demonstrate the kind of
QA discipline I bring to a project — not just "does it work" but "how do I
know it still works tomorrow."

## The testing pyramid as applied here

```
                ┌─────────────────────────┐
                │   E2E (Playwright)      │   3 specs · real browser
                │   tests/e2e/            │   network mocked at the route layer
                └──────────┬──────────────┘
                ┌──────────┴──────────────┐
                │   Integration (Vitest)  │   1 file · 5 tests
                │   tests/integration/    │   exercises the API route + lib/
                └──────────┬──────────────┘
                ┌──────────┴──────────────┐
                │   Component (RTL)       │   3 files · 22 tests
                │   tests/component/      │   render → assert visible UI
                └──────────┬──────────────┘
                ┌──────────┴──────────────┐
                │   Unit (Vitest)         │   3 files · 64 tests
                │   tests/unit/           │   pure helpers in lib/
                └─────────────────────────┘
```

Pure functions are the cheapest tests to write and the most stable, so the
base of the pyramid is the widest. End-to-end specs sit on top: few in
number, more expensive to run, but invaluable as a smoke check that the
whole machine is wired together.

## Stack

| Layer | Tool | Why |
|-------|------|-----|
| Unit & component | [Vitest](https://vitest.dev/) | Native TS/ESM, very fast, jest-compatible API, first-class support for Vite/Next.js projects |
| Component DOM | [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | Tests behaviour via accessible queries — exactly how a screen reader (and a user) would interact |
| Integration | Vitest + `vi.fn()` | Stubs `globalThis.fetch` so the real API handler runs without external dependencies |
| End-to-end | [Playwright](https://playwright.dev/) | Modern, hermetic, runs the real built app; `page.route()` keeps network deterministic |
| CI | GitHub Actions | Runs the full suite on every push & PR; uploads coverage and Playwright reports as artifacts |

## How to run

```bash
# unit + component + integration (~1.5s)
npm test

# watch mode while developing
npm run test:watch

# pretty UI for browsing tests
npm run test:ui

# with coverage report (writes coverage/index.html)
npm run test:coverage

# end-to-end (auto-starts next dev on :3000)
npm run test:e2e

# Playwright UI mode — best for debugging an E2E flake
npm run test:e2e:ui
```

## What's covered

### Unit tests — `tests/unit/`

Pure helpers in `lib/`:

- **`utils.ts`** — `cn` class merging (including Tailwind conflict resolution),
  `fmt` placeholder interpolation, `relativeTime` across every time bucket
  in both `en` and `tr` locales.
- **`i18n.ts`** — locale dispatch, dot-path lookup, missing-key fallback.
- **`github.ts`** — `sumCounts`, `clampLevel` (boundary cases), `computeStreaks`
  (empty, single, broken, in-progress today), `computeLanguages` (forks
  excluded, percentage math, top-6 cap), `mapEvents` (every event kind,
  count cap, missing-repo skip).

Test data lives in `tests/unit/fixtures/` so the assertions stay focused on
behaviour, not setup.

### Component tests — `tests/component/`

React Testing Library against jsdom. Each component is rendered with
realistic prop fixtures and verified for:

- Localized strings in both `en` and `tr`
- Empty states
- Conditional copy (singular vs plural, fallbacks, sub-labels)
- External link safety (`target=_blank` with `noopener noreferrer`)

`framer-motion` is mocked at the module boundary so animation timings don't
turn into test flake.

### Integration test — `tests/integration/`

Runs the real `GET` handler from `app/api/github/route.ts` with
`globalThis.fetch` stubbed. Asserts:

- Happy-path response shape
- `generatedAt` freshness
- Selection of GraphQL vs public-calendar source based on `GITHUB_TOKEN`
- Graceful degradation to `ok: false` when every fetch rejects

### End-to-end tests — `tests/e2e/`

Playwright drives Chromium against `next dev`. `/api/github` is mocked via
`page.route` for deterministic dashboard rendering.

- `homepage.spec.ts` — `/` redirects to default locale; all section anchors
  are mounted; `<html lang>` is correct.
- `locale-switch.spec.ts` — `/en` and `/tr` render their respective nav
  labels; `<html lang>` matches the route.
- `github-section.spec.ts` — dashboard renders the mocked fixture data;
  graceful error UI appears on a 500 response.

## Coverage targets

Coverage is enforced by Vitest (`vitest.config.ts`):

| Bucket | Target |
|--------|--------|
| lines | 70% |
| functions | 70% |
| branches | 70% |
| statements | 70% |

Lower thresholds, when met, are pinned ratchets — they don't drop without
an explicit change.

## CI

Every push and pull request runs `.github/workflows/ci.yml`:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck` (`tsc --noEmit`)
4. `npm run test:coverage`
5. `npx playwright install chromium`
6. `npm run build && npx playwright test`

Failed runs upload the full Playwright HTML report as an artifact so a
flake can be replayed without re-running the suite locally.
