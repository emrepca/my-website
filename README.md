# Portfolio Website — [emrepaca.com](https://emrepaca.com)

[![CI](https://github.com/emrepca/my-website/actions/workflows/ci.yml/badge.svg)](https://github.com/emrepca/my-website/actions/workflows/ci.yml)
[![Tests: Vitest + Playwright](https://img.shields.io/badge/tests-vitest%20%2B%20playwright-3ea24c)](./TESTING.md)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript)](https://www.typescriptlang.org/)

Personal portfolio for **Muhammet Emre Paça** — a single-page site built with
Next.js 15 (App Router), React 19, TypeScript, and Tailwind CSS.

It pulls live data from the GitHub API for the "Developer Activity"
dashboard (contribution graph, streaks, language breakdown, recent events)
and ships with full English / Turkish localization.

## Highlights

- **Internationalized routing** via Next.js middleware (`/en`, `/tr`)
- **Live GitHub API integration** with server-side caching to stay polite
  about rate limits
- **Accessible, prefers-reduced-motion-aware animations** powered by
  Framer Motion
- **Dark/light theme** with system preference detection
- **Layered automated test suite** (see below) running on every push

## Tech stack

Next.js 15 · React 19 · TypeScript 5 · Tailwind CSS 3 · Framer Motion ·
lucide-react · next-themes

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

To unlock the GitHub GraphQL contribution calendar and the higher REST rate
limit, copy `.env.example` to `.env.local` and add a GitHub token (a classic
token with no scopes is enough).

## Testing

This repo ships with a layered test suite — unit, component, integration,
and end-to-end — that runs on every push via GitHub Actions.

| Command | What it runs |
|---------|--------------|
| `npm test` | All unit, component, and integration tests (Vitest) |
| `npm run test:coverage` | Same, with an HTML coverage report |
| `npm run test:e2e` | End-to-end tests (Playwright, Chromium) |
| `npm run typecheck` | `tsc --noEmit` strict-mode check |
| `npm run lint` | Next.js ESLint configuration |

See [TESTING.md](./TESTING.md) for the testing strategy, layer-by-layer
coverage, and CI details.

## License

All rights reserved.
