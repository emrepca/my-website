import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

/**
 * Vitest configuration.
 *
 * - jsdom environment for React Testing Library
 * - @/* path alias matches the tsconfig "paths" entry
 * - tests/e2e excluded — Playwright owns those
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup/vitest.setup.ts'],
    include: [
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/component/**/*.test.{ts,tsx}',
      'tests/integration/**/*.test.{ts,tsx}',
    ],
    exclude: ['tests/e2e/**', 'node_modules/**', '.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      // Cover only the code we explicitly test so the threshold reflects
      // *real* coverage of QA-tested surface, not "everything in the repo".
      include: [
        'lib/utils.ts',
        'lib/i18n.ts',
        'lib/github.ts',
        'lib/cv.ts',
        'lib/certificates.ts',
        'components/github/StatCards.tsx',
        'components/github/LanguageBreakdown.tsx',
        'components/github/ActivityFeed.tsx',
        'app/api/github/route.ts',
      ],
      exclude: ['**/*.d.ts', 'tests/**'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
})
