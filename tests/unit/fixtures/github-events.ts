/**
 * Event payload fixtures for `mapEvents` tests.
 *
 * The shape mirrors the GitHub REST `/users/:user/events/public` response —
 * we only include the fields `mapEvents` actually reads, so the fixtures stay
 * small and obviously-correct.
 */
export interface RawEventFixture {
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

const createdAt = '2025-05-24T10:00:00Z'

export const pushEvent: RawEventFixture = {
  id: 'evt-push',
  type: 'PushEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
  payload: {
    size: 3,
    commits: [
      { message: 'first commit' },
      { message: 'second commit' },
      { message: 'feat: add testing\n\nMore details below' },
    ],
  },
}

export const createRepoEvent: RawEventFixture = {
  id: 'evt-create-repo',
  type: 'CreateEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/new-thing' },
  payload: { ref_type: 'repository' },
}

export const createBranchEvent: RawEventFixture = {
  id: 'evt-create-branch',
  type: 'CreateEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
  payload: { ref_type: 'branch', ref: 'feature/x' },
}

export const pullRequestOpenedEvent: RawEventFixture = {
  id: 'evt-pr-opened',
  type: 'PullRequestEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
  payload: { action: 'opened' },
}

export const pullRequestClosedEvent: RawEventFixture = {
  id: 'evt-pr-closed',
  type: 'PullRequestEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
  payload: { action: 'closed' },
}

export const releaseEvent: RawEventFixture = {
  id: 'evt-release',
  type: 'ReleaseEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
  payload: { release: { tag_name: 'v1.2.0' } },
}

export const issueOpenedEvent: RawEventFixture = {
  id: 'evt-issue-opened',
  type: 'IssuesEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
  payload: { action: 'opened' },
}

export const issueLabeledEvent: RawEventFixture = {
  id: 'evt-issue-labeled',
  type: 'IssuesEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
  payload: { action: 'labeled' },
}

export const watchEvent: RawEventFixture = {
  id: 'evt-watch',
  type: 'WatchEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
}

export const forkEvent: RawEventFixture = {
  id: 'evt-fork',
  type: 'ForkEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
}

export const publicEvent: RawEventFixture = {
  id: 'evt-public',
  type: 'PublicEvent',
  created_at: createdAt,
  repo: { name: 'emrepca/my-website' },
}

export const eventMissingRepo: RawEventFixture = {
  id: 'evt-no-repo',
  type: 'PushEvent',
  created_at: createdAt,
}
