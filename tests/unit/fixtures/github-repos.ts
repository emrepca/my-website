/**
 * Repo fixtures for `computeLanguages` tests.
 *
 * `RawRepo` is internal to lib/github.ts, but we know its shape from the
 * source — we keep this fixture aligned with that shape.
 */
export interface RawRepoFixture {
  name: string
  html_url: string
  fork: boolean
  stargazers_count: number
  language: string | null
  pushed_at: string
}

const base = {
  html_url: 'https://github.com/emrepca/x',
  fork: false,
  stargazers_count: 0,
  pushed_at: '2025-05-20T00:00:00Z',
}

/** Mix of languages with one fork and one null-language repo. */
export const mixedRepos: RawRepoFixture[] = [
  { ...base, name: 'a', language: 'TypeScript', stargazers_count: 4 },
  { ...base, name: 'b', language: 'TypeScript' },
  { ...base, name: 'c', language: 'TypeScript' },
  { ...base, name: 'd', language: 'Python' },
  { ...base, name: 'e', language: 'Python' },
  { ...base, name: 'f', language: 'Go' },
  // Forks must be excluded from language stats.
  { ...base, name: 'fork-1', language: 'Rust', fork: true },
  // Repos without a detected language must be excluded.
  { ...base, name: 'g', language: null },
]

/** More than 6 distinct languages — used to verify the top-6 cap. */
export const manyLanguageRepos: RawRepoFixture[] = [
  { ...base, name: 'a', language: 'TypeScript' },
  { ...base, name: 'b', language: 'JavaScript' },
  { ...base, name: 'c', language: 'Python' },
  { ...base, name: 'd', language: 'Go' },
  { ...base, name: 'e', language: 'Rust' },
  { ...base, name: 'f', language: 'Java' },
  { ...base, name: 'g', language: 'Ruby' },
  { ...base, name: 'h', language: 'Swift' },
]

/** Repo with an unknown language — should fall back to the accent color. */
export const exoticLanguageRepos: RawRepoFixture[] = [
  { ...base, name: 'x', language: 'Brainfuck' },
]
