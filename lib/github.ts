import { GITHUB_USERNAME } from '@/constants/config'
import type {
  ActivityItem,
  CalendarSource,
  ContributionCalendar,
  ContributionDay,
  ContributionLevel,
  GitHubData,
  GitHubProfile,
  GitHubStats,
  LanguageStat,
} from '@/types/github'

/**
 * Server-side GitHub data layer.
 *
 * Every request is cached through the Next.js Data Cache (`next.revalidate`),
 * so visitor traffic never translates 1:1 into GitHub API calls — at most a
 * handful of requests per revalidation window. The contribution calendar uses
 * the official GraphQL API when `GITHUB_TOKEN` is set, and otherwise falls back
 * to a public no-auth contributions API.
 */

const API_BASE = 'https://api.github.com'
const REVALIDATE = 300 // 5 minutes

const FALLBACK_COLOR = '#6366f1'

/** Brand colours for the most common languages; falls back to the accent. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Java: '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  Shell: '#89e051',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Astro: '#ff5a03',
  MDX: '#fcb32c',
  'Jupyter Notebook': '#da5b0b',
  Dockerfile: '#384d54',
  Lua: '#000080',
  'Objective-C': '#438eff',
  PowerShell: '#012456',
  Solidity: '#aa6746',
}

const GRAPHQL_LEVEL: Record<string, ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': `${GITHUB_USERNAME}-portfolio`,
    'X-GitHub-Api-Version': '2022-11-28',
    ...extra,
  }
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

/* ----------------------------- Raw API shapes ----------------------------- */

interface RawProfile {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  public_repos: number
  followers: number
  created_at: string
}

interface RawRepo {
  name: string
  html_url: string
  fork: boolean
  stargazers_count: number
  language: string | null
  pushed_at: string
}

interface RawEvent {
  id: string
  type?: string
  created_at: string
  repo?: { name?: string }
  payload?: {
    ref_type?: string
    ref?: string
    action?: string
    size?: number
    commits?: Array<{ message?: string }>
    release?: { tag_name?: string }
  }
}

/* ------------------------------- Fetchers --------------------------------- */

async function fetchProfile(): Promise<RawProfile | null> {
  try {
    const res = await fetch(`${API_BASE}/users/${GITHUB_USERNAME}`, {
      headers: buildHeaders(),
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return null
    return (await res.json()) as RawProfile
  } catch {
    return null
  }
}

async function fetchRepos(): Promise<RawRepo[]> {
  try {
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&sort=pushed&type=owner`,
      { headers: buildHeaders(), next: { revalidate: REVALIDATE } },
    )
    if (!res.ok) return []
    const data = (await res.json()) as RawRepo[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function fetchEvents(): Promise<RawEvent[]> {
  try {
    const res = await fetch(
      `${API_BASE}/users/${GITHUB_USERNAME}/events/public?per_page=30`,
      { headers: buildHeaders(), next: { revalidate: REVALIDATE } },
    )
    if (!res.ok) return []
    const data = (await res.json()) as RawEvent[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

/** Official contribution calendar — needs an authenticated token. */
async function fetchCalendarGraphQL(token: string): Promise<ContributionCalendar | null> {
  const query = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{date contributionCount contributionLevel}}}}}}`
  try {
    const res = await fetch(`${API_BASE}/graphql`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': `${GITHUB_USERNAME}-portfolio`,
      },
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
      next: { revalidate: REVALIDATE },
    })
    if (!res.ok) return null
    const json = (await res.json()) as {
      data?: {
        user?: {
          contributionsCollection?: {
            contributionCalendar?: {
              totalContributions?: number
              weeks?: Array<{
                contributionDays: Array<{
                  date: string
                  contributionCount: number
                  contributionLevel: string
                }>
              }>
            }
          }
        }
      }
    }
    const calendar = json.data?.user?.contributionsCollection?.contributionCalendar
    if (!calendar?.weeks) return null
    const days: ContributionDay[] = []
    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        days.push({
          date: day.date,
          count: day.contributionCount,
          level: GRAPHQL_LEVEL[day.contributionLevel] ?? 0,
        })
      }
    }
    return { total: calendar.totalContributions ?? sumCounts(days), days }
  } catch {
    return null
  }
}

/** Public no-auth fallback for the contribution calendar. */
async function fetchCalendarPublic(): Promise<ContributionCalendar | null> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`,
      { next: { revalidate: REVALIDATE } },
    )
    if (!res.ok) return null
    const json = (await res.json()) as {
      total?: Record<string, number>
      contributions?: Array<{ date: string; count: number; level: number }>
    }
    if (!json.contributions?.length) return null
    const days: ContributionDay[] = json.contributions.map((c) => ({
      date: c.date,
      count: c.count,
      level: clampLevel(c.level),
    }))
    const total = json.total?.lastYear ?? sumCounts(days)
    return { total, days }
  } catch {
    return null
  }
}

/* ------------------------------ Transforms -------------------------------- */

function sumCounts(days: ContributionDay[]): number {
  return days.reduce((sum, day) => sum + day.count, 0)
}

function clampLevel(value: number): ContributionLevel {
  const rounded = Math.round(value)
  if (rounded <= 0) return 0
  if (rounded >= 4) return 4
  return rounded as ContributionLevel
}

function computeStreaks(days: ContributionDay[]): { current: number; longest: number } {
  if (days.length === 0) return { current: 0, longest: 0 }
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))

  let longest = 0
  let run = 0
  for (const day of sorted) {
    if (day.count > 0) {
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 0
    }
  }

  // Current streak: walk back from the most recent day. The final day may be
  // "today" and still in progress, so an empty trailing day is ignored.
  let current = 0
  let i = sorted.length - 1
  if (sorted[i].count === 0) i -= 1
  for (; i >= 0; i -= 1) {
    if (sorted[i].count > 0) current += 1
    else break
  }

  return { current, longest }
}

function computeLanguages(repos: RawRepo[]): LanguageStat[] {
  const counts = new Map<string, number>()
  for (const repo of repos) {
    if (repo.fork || !repo.language) continue
    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1)
  }
  const total = [...counts.values()].reduce((sum, n) => sum + n, 0)
  if (total === 0) return []

  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / total) * 100),
      color: LANGUAGE_COLORS[name] ?? FALLBACK_COLOR,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
}

function mapEvents(events: RawEvent[]): ActivityItem[] {
  const items: ActivityItem[] = []

  for (const event of events) {
    const repo = event.repo?.name
    if (!repo) continue

    const base = {
      id: event.id,
      repo,
      repoUrl: `https://github.com/${repo}`,
      createdAt: event.created_at,
    }
    const payload = event.payload ?? {}

    switch (event.type) {
      case 'PushEvent': {
        const commits = payload.commits ?? []
        const lastMessage = commits[commits.length - 1]?.message?.split('\n')[0] ?? null
        items.push({
          ...base,
          kind: 'push',
          count: payload.size ?? commits.length,
          detail: lastMessage,
        })
        break
      }
      case 'CreateEvent': {
        if (payload.ref_type === 'repository') {
          items.push({ ...base, kind: 'create-repo', count: null, detail: null })
        } else if (payload.ref_type === 'branch' || payload.ref_type === 'tag') {
          items.push({ ...base, kind: 'create-branch', count: null, detail: payload.ref ?? null })
        }
        break
      }
      case 'PullRequestEvent':
        if (payload.action === 'opened' || payload.action === 'reopened') {
          items.push({ ...base, kind: 'pr', count: null, detail: null })
        }
        break
      case 'ReleaseEvent':
        items.push({ ...base, kind: 'release', count: null, detail: payload.release?.tag_name ?? null })
        break
      case 'IssuesEvent':
        if (payload.action === 'opened') {
          items.push({ ...base, kind: 'issue', count: null, detail: null })
        }
        break
      case 'WatchEvent':
        items.push({ ...base, kind: 'star', count: null, detail: null })
        break
      case 'ForkEvent':
        items.push({ ...base, kind: 'fork', count: null, detail: null })
        break
      case 'PublicEvent':
        items.push({ ...base, kind: 'public', count: null, detail: null })
        break
    }
  }

  return items.slice(0, 8)
}

/* -------------------------------- Public ---------------------------------- */

export async function getGitHubData(): Promise<GitHubData> {
  const token = process.env.GITHUB_TOKEN

  const [profile, repos, events, graphqlCalendar] = await Promise.all([
    fetchProfile(),
    fetchRepos(),
    fetchEvents(),
    token ? fetchCalendarGraphQL(token) : Promise.resolve(null),
  ])

  let calendar = graphqlCalendar
  let source: CalendarSource = calendar ? 'graphql' : 'none'
  if (!calendar) {
    calendar = await fetchCalendarPublic()
    if (calendar) source = 'public'
  }

  const streaks = calendar ? computeStreaks(calendar.days) : { current: 0, longest: 0 }
  const languages = computeLanguages(repos)
  const stars = repos
    .filter((repo) => !repo.fork)
    .reduce((sum, repo) => sum + repo.stargazers_count, 0)

  const currentYear = new Date().getFullYear()
  const accountYear = profile ? new Date(profile.created_at).getFullYear() : currentYear

  const stats: GitHubStats | null = profile
    ? {
        repos: profile.public_repos,
        contributions: calendar?.total ?? 0,
        stars,
        followers: profile.followers,
        currentStreak: streaks.current,
        longestStreak: streaks.longest,
        topLanguage: languages[0]?.name ?? null,
        topLanguageColor: languages[0]?.color ?? null,
        accountYear,
        yearsActive: Math.max(1, currentYear - accountYear),
      }
    : null

  const profileOut: GitHubProfile | null = profile
    ? {
        login: profile.login,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        htmlUrl: profile.html_url,
        bio: profile.bio,
      }
    : null

  return {
    ok: Boolean(profile || calendar),
    profile: profileOut,
    stats,
    calendar,
    languages,
    activity: mapEvents(events),
    source,
    generatedAt: new Date().toISOString(),
  }
}
