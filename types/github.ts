/** Contribution intensity, mirroring GitHub's 5-step scale. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  date: string
  count: number
  level: ContributionLevel
}

export interface ContributionCalendar {
  total: number
  days: ContributionDay[]
}

export interface GitHubProfile {
  login: string
  name: string | null
  avatarUrl: string
  htmlUrl: string
  bio: string | null
}

export interface GitHubStats {
  repos: number
  contributions: number
  stars: number
  followers: number
  currentStreak: number
  longestStreak: number
  topLanguage: string | null
  topLanguageColor: string | null
  accountYear: number
  yearsActive: number
}

export interface LanguageStat {
  name: string
  count: number
  percent: number
  color: string
}

export type ActivityKind =
  | 'push'
  | 'create-repo'
  | 'create-branch'
  | 'pr'
  | 'star'
  | 'fork'
  | 'release'
  | 'issue'
  | 'public'

export interface ActivityItem {
  id: string
  kind: ActivityKind
  repo: string
  repoUrl: string
  detail: string | null
  count: number | null
  createdAt: string
}

/** Where the contribution calendar was sourced from. */
export type CalendarSource = 'graphql' | 'public' | 'none'

export interface GitHubData {
  ok: boolean
  profile: GitHubProfile | null
  stats: GitHubStats | null
  calendar: ContributionCalendar | null
  languages: LanguageStat[]
  activity: ActivityItem[]
  source: CalendarSource
  generatedAt: string
}
