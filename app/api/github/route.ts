import { NextResponse } from 'next/server'
import { getGitHubData } from '@/lib/github'
import type { GitHubData } from '@/types/github'

/**
 * Cached GitHub activity endpoint.
 *
 * The route response is regenerated at most once every 30 minutes (ISR), and
 * the underlying GitHub fetches are themselves cached — so the GitHub API is
 * never hammered, regardless of how much traffic this endpoint receives.
 */
export const revalidate = 1800

export async function GET() {
  try {
    const data = await getGitHubData()
    return NextResponse.json(data)
  } catch {
    const empty: GitHubData = {
      ok: false,
      profile: null,
      stats: null,
      calendar: null,
      languages: [],
      activity: [],
      source: 'none',
      generatedAt: new Date().toISOString(),
    }
    return NextResponse.json(empty)
  }
}
