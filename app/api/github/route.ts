import { NextResponse } from 'next/server'
import { getGitHubData } from '@/lib/github'
import type { GitHubData } from '@/types/github'

/**
 * GitHub activity endpoint.
 *
 * The route runs on every request, but the underlying GitHub fetches are
 * cached in the Next.js Data Cache (see `lib/github.ts`) — so the GitHub API
 * is only hit at most a handful of times per revalidation window, regardless
 * of traffic. Running the handler each time keeps `generatedAt` fresh and
 * avoids ISR-wide route caching freezing the response between revalidations.
 */
export const dynamic = 'force-dynamic'

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
