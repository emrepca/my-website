/**
 * Integration test for `GET /api/github`.
 *
 * Mocks `globalThis.fetch` at the network seam so we exercise the real:
 *   - app/api/github/route.ts handler
 *   - lib/github.ts#getGitHubData orchestration
 *   - all of the pure transforms (computeStreaks, computeLanguages, mapEvents, etc.)
 *
 * Verifies four contracts of the API:
 *   1. Happy path — shape and freshness of the JSON response
 *   2. GraphQL calendar path is selected when GITHUB_TOKEN is set
 *   3. Public fallback calendar is selected when GITHUB_TOKEN is unset
 *   4. Total network failure degrades to ok:false instead of throwing
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/github/route'

type FetchInput = Parameters<typeof fetch>[0]

interface MockProfile {
  login: string
  name: string
  avatar_url: string
  html_url: string
  bio: string | null
  public_repos: number
  followers: number
  created_at: string
}

const sampleProfile: MockProfile = {
  login: 'emrepca',
  name: 'Emre',
  avatar_url: 'https://example.test/avatar.png',
  html_url: 'https://github.com/emrepca',
  bio: 'hi',
  public_repos: 12,
  followers: 7,
  created_at: '2020-01-01T00:00:00Z',
}

const sampleRepos = [
  {
    name: 'a',
    html_url: 'x',
    fork: false,
    stargazers_count: 4,
    language: 'TypeScript',
    pushed_at: '2025-05-22T00:00:00Z',
  },
  {
    name: 'b',
    html_url: 'x',
    fork: false,
    stargazers_count: 1,
    language: 'Python',
    pushed_at: '2025-05-22T00:00:00Z',
  },
]

const sampleEvents = [
  {
    id: 'e1',
    type: 'PushEvent',
    created_at: '2025-05-22T00:00:00Z',
    repo: { name: 'emrepca/my-website' },
    payload: { size: 1, commits: [{ message: 'feat: thing' }] },
  },
]

const sampleGraphQLCalendar = {
  data: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: 5,
          weeks: [
            {
              contributionDays: [
                { date: '2025-05-22', contributionCount: 2, contributionLevel: 'FIRST_QUARTILE' },
                { date: '2025-05-23', contributionCount: 3, contributionLevel: 'SECOND_QUARTILE' },
              ],
            },
          ],
        },
      },
    },
  },
}

const samplePublicCalendar = {
  total: { lastYear: 4 },
  contributions: [
    { date: '2025-05-22', count: 2, level: 1 },
    { date: '2025-05-23', count: 2, level: 1 },
  ],
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

interface RouteMap {
  profile?: () => Response
  repos?: () => Response
  events?: () => Response
  graphql?: () => Response
  publicCalendar?: () => Response
}

function installFetchMock(routes: RouteMap) {
  const mock = vi.fn(async (input: FetchInput) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    if (url.includes('/graphql')) return routes.graphql?.() ?? jsonResponse({})
    if (url.includes('/users/') && url.endsWith('/emrepca')) {
      return routes.profile?.() ?? jsonResponse(sampleProfile)
    }
    if (url.includes('/users/emrepca/repos')) {
      return routes.repos?.() ?? jsonResponse(sampleRepos)
    }
    if (url.includes('/users/emrepca/events')) {
      return routes.events?.() ?? jsonResponse(sampleEvents)
    }
    if (url.includes('github-contributions-api.jogruber.de')) {
      return routes.publicCalendar?.() ?? jsonResponse(samplePublicCalendar)
    }
    return jsonResponse({})
  })
  globalThis.fetch = mock as unknown as typeof fetch
  return mock
}

const originalFetch = globalThis.fetch
const originalToken = process.env.GITHUB_TOKEN

afterEach(() => {
  globalThis.fetch = originalFetch
  if (originalToken === undefined) delete process.env.GITHUB_TOKEN
  else process.env.GITHUB_TOKEN = originalToken
  vi.restoreAllMocks()
})

describe('GET /api/github — happy path with GITHUB_TOKEN set', () => {
  beforeEach(() => {
    process.env.GITHUB_TOKEN = 'test-token'
  })

  it('returns a populated GitHubData payload with ok:true', async () => {
    installFetchMock({})

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body.ok).toBe(true)
    expect(body.profile).toMatchObject({ login: 'emrepca', name: 'Emre' })
    expect(body.stats).toMatchObject({
      repos: 12,
      followers: 7,
      stars: 5,
      accountYear: 2020,
      topLanguage: 'TypeScript',
    })
    expect(body.languages.map((l: { name: string }) => l.name)).toEqual(['TypeScript', 'Python'])
    expect(body.activity).toHaveLength(1)
    expect(body.activity[0]).toMatchObject({ kind: 'push', repo: 'emrepca/my-website' })
  })

  it('uses the GraphQL calendar source when a token is present', async () => {
    const mock = installFetchMock({ graphql: () => jsonResponse(sampleGraphQLCalendar) })
    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('graphql')
    expect(body.calendar.total).toBe(5)

    const calledUrls = mock.mock.calls.map((c) => (typeof c[0] === 'string' ? c[0] : ''))
    expect(calledUrls.some((u) => u.includes('/graphql'))).toBe(true)
  })

  it('stamps generatedAt with a fresh ISO timestamp', async () => {
    installFetchMock({})
    const before = Date.now()
    const res = await GET()
    const body = await res.json()
    const after = Date.now()

    const stamp = new Date(body.generatedAt).getTime()
    expect(stamp).toBeGreaterThanOrEqual(before - 1000)
    expect(stamp).toBeLessThanOrEqual(after + 1000)
  })
})

describe('GET /api/github — no GITHUB_TOKEN', () => {
  beforeEach(() => {
    delete process.env.GITHUB_TOKEN
  })

  it('falls back to the public contributions API', async () => {
    const mock = installFetchMock({})
    const res = await GET()
    const body = await res.json()

    expect(body.source).toBe('public')
    expect(body.calendar.total).toBe(4)

    const calledUrls = mock.mock.calls.map((c) => (typeof c[0] === 'string' ? c[0] : ''))
    expect(calledUrls.some((u) => u.includes('github-contributions-api'))).toBe(true)
    expect(calledUrls.some((u) => u.includes('/graphql'))).toBe(false)
  })
})

describe('GET /api/github — degraded path', () => {
  it('returns ok:false (without throwing) when every fetch fails', async () => {
    globalThis.fetch = vi.fn(async () => {
      throw new Error('network down')
    }) as unknown as typeof fetch

    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body.ok).toBe(false)
    expect(body.profile).toBeNull()
    expect(body.stats).toBeNull()
    expect(body.activity).toEqual([])
    expect(body.languages).toEqual([])
    expect(body.source).toBe('none')
  })

  it('catches unexpected throws from getGitHubData and returns the empty fallback', async () => {
    // The route handler has its own try/catch as a defense-in-depth net for the
    // case where an upstream change in lib/github.ts starts throwing. Mock the
    // module to simulate that scenario.
    vi.resetModules()
    vi.doMock('@/lib/github', () => ({
      getGitHubData: vi.fn(async () => {
        throw new Error('boom')
      }),
    }))
    const { GET: GETMocked } = await import('@/app/api/github/route')

    const res = await GETMocked()
    expect(res.status).toBe(200)
    const body = await res.json()

    expect(body.ok).toBe(false)
    expect(body.profile).toBeNull()
    expect(body.source).toBe('none')

    vi.doUnmock('@/lib/github')
  })
})
