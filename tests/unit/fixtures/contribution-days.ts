/**
 * Fixtures for contribution-calendar related tests.
 *
 * Building these by hand (rather than copying live API output) lets each test
 * declare exactly the streak/level shape it wants to verify.
 */
import type { ContributionDay } from '@/types/github'

export function day(date: string, count: number): ContributionDay {
  const level = count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4
  return { date, count, level: level as ContributionDay['level'] }
}

/** 7 consecutive contribution days — should yield streak of 7. */
export const sevenDayStreak: ContributionDay[] = [
  day('2025-05-18', 4),
  day('2025-05-19', 2),
  day('2025-05-20', 1),
  day('2025-05-21', 7),
  day('2025-05-22', 3),
  day('2025-05-23', 9),
  day('2025-05-24', 11),
]

/** Streak broken by a zero day in the middle. */
export const brokenStreak: ContributionDay[] = [
  day('2025-05-18', 3),
  day('2025-05-19', 2),
  day('2025-05-20', 0),
  day('2025-05-21', 4),
  day('2025-05-22', 1),
]

/** A streak that's still active but the trailing "today" is empty (in progress). */
export const inProgressStreak: ContributionDay[] = [
  day('2025-05-21', 2),
  day('2025-05-22', 3),
  day('2025-05-23', 1),
  day('2025-05-24', 0),
]

/** No contributions at all. */
export const emptyDays: ContributionDay[] = [
  day('2025-05-22', 0),
  day('2025-05-23', 0),
  day('2025-05-24', 0),
]
