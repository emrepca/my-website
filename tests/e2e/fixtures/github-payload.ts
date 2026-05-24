/**
 * Stable `GitHubData` payload used by every E2E spec.
 *
 * Keeping a single fixture makes assertions reliable — every page render is
 * driven by the same input, so a flake means a real regression, not a GitHub
 * API change.
 */
export const githubPayload = {
  ok: true,
  profile: {
    login: 'emrepca',
    name: 'Emre',
    avatarUrl: 'https://example.test/avatar.png',
    htmlUrl: 'https://github.com/emrepca',
    bio: 'hi',
  },
  stats: {
    repos: 42,
    contributions: 730,
    stars: 17,
    followers: 5,
    currentStreak: 4,
    longestStreak: 11,
    topLanguage: 'TypeScript',
    topLanguageColor: '#3178c6',
    accountYear: 2020,
    yearsActive: 5,
  },
  calendar: {
    total: 730,
    days: Array.from({ length: 365 }, (_, i) => ({
      date: `2024-${String(((i % 12) + 1)).padStart(2, '0')}-01`,
      count: i % 5,
      level: (i % 5) as 0 | 1 | 2 | 3 | 4,
    })),
  },
  languages: [
    { name: 'TypeScript', count: 8, percent: 50, color: '#3178c6' },
    { name: 'Python', count: 4, percent: 25, color: '#3572a5' },
    { name: 'Go', count: 4, percent: 25, color: '#00add8' },
  ],
  activity: [
    {
      id: 'evt-1',
      kind: 'push' as const,
      repo: 'emrepca/my-website',
      repoUrl: 'https://github.com/emrepca/my-website',
      detail: 'feat: add tests',
      count: 3,
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    },
    {
      id: 'evt-2',
      kind: 'release' as const,
      repo: 'emrepca/my-website',
      repoUrl: 'https://github.com/emrepca/my-website',
      detail: 'v1.0.0',
      count: null,
      createdAt: new Date(Date.now() - 60_000).toISOString(),
    },
  ],
  source: 'graphql' as const,
  generatedAt: new Date().toISOString(),
}
