'use client'

import { useMemo, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { t } from '@/lib/i18n'
import { fmt } from '@/lib/utils'
import type { Locale } from '@/constants/config'
import type {
  ContributionCalendar,
  ContributionDay,
  ContributionLevel,
} from '@/types/github'

interface ContributionHeatmapProps {
  lang: Locale
  calendar: ContributionCalendar
}

type Cell = ContributionDay | null

interface HoverState {
  day: ContributionDay
  x: number
  y: number
}

/** Cell + gap, in pixels — used to position the floating month labels. */
const STEP = 15
const GUTTER = 30

const LEVEL_OPACITY: Record<Exclude<ContributionLevel, 0>, number> = {
  1: 30,
  2: 52,
  3: 74,
  4: 100,
}

function cellColor(level: ContributionLevel): string {
  if (level === 0) return 'color-mix(in srgb, var(--muted-foreground) 13%, transparent)'
  return `color-mix(in srgb, var(--accent) ${LEVEL_OPACITY[level]}%, transparent)`
}

/** Splits the flat day list into Sunday-aligned week columns. */
function buildWeeks(days: ContributionDay[]): Cell[][] {
  if (days.length === 0) return []
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  const firstWeekday = new Date(`${sorted[0].date}T00:00:00Z`).getUTCDay()
  const cells: Cell[] = [...Array<Cell>(firstWeekday).fill(null), ...sorted]

  const weeks: Cell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    const week = cells.slice(i, i + 7)
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

function buildMonthLabels(weeks: Cell[][], lang: Locale): Array<{ col: number; label: string }> {
  const formatter = new Intl.DateTimeFormat(lang, { month: 'short' })
  const labels: Array<{ col: number; label: string }> = []
  let lastMonth = -1
  let lastCol = -10

  weeks.forEach((week, col) => {
    const firstDay = week.find((cell): cell is ContributionDay => cell !== null)
    if (!firstDay) return
    const month = new Date(`${firstDay.date}T00:00:00Z`).getUTCMonth()
    if (month === lastMonth) return
    lastMonth = month
    if (col - lastCol >= 3) {
      labels.push({ col, label: formatter.format(new Date(`${firstDay.date}T12:00:00`)) })
      lastCol = col
    }
  })
  return labels
}

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.014 } },
}

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export function ContributionHeatmap({ lang, calendar }: ContributionHeatmapProps) {
  const [hover, setHover] = useState<HoverState | null>(null)

  const weeks = useMemo(() => buildWeeks(calendar.days), [calendar.days])
  const months = useMemo(() => buildMonthLabels(weeks, lang), [weeks, lang])

  const fullDateFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(lang, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [lang],
  )

  // Mon / Wed / Fri row labels, derived from a known Sunday.
  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(lang, { weekday: 'short' })
    const sunday = Date.UTC(2023, 0, 1)
    const labels: Record<number, string> = {}
    for (const row of [1, 3, 5]) {
      labels[row] = formatter.format(new Date(sunday + row * 86_400_000))
    }
    return labels
  }, [lang])

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 md:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/40 text-[color:var(--accent)]">
            <CalendarDays className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t(lang, 'sections.github.heatmap.title')}
            </h3>
            <p className="mt-0.5 text-sm text-[color:var(--muted-foreground)]">
              {fmt(t(lang, 'sections.github.heatmap.subtitle'), {
                n: new Intl.NumberFormat(lang).format(calendar.total),
              })}
            </p>
          </div>
        </div>
        <Legend lang={lang} />
      </div>

      {weeks.length > 0 && (
        <div className="mt-6 overflow-x-auto pb-1">
          <div className="inline-block min-w-max">
            {/* Month labels */}
            <div className="flex">
              <div style={{ width: GUTTER }} className="shrink-0" />
              <div className="relative h-5" style={{ width: weeks.length * STEP }}>
                {months.map((month) => (
                  <span
                    key={`${month.col}-${month.label}`}
                    className="absolute top-0 text-[10px] font-medium text-[color:var(--muted-foreground)]"
                    style={{ left: month.col * STEP }}
                  >
                    {month.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Weekday gutter + contribution grid */}
            <div className="flex">
              <div
                style={{ width: GUTTER }}
                className="flex shrink-0 flex-col gap-[3px] pr-1.5"
              >
                {Array.from({ length: 7 }).map((_, row) => (
                  <div
                    key={row}
                    className="flex h-3 items-center justify-end text-[9px] leading-none text-[color:var(--muted-foreground)]"
                  >
                    {weekdayLabels[row] ?? ''}
                  </div>
                ))}
              </div>

              <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                className="flex gap-[3px]"
              >
                {weeks.map((week, weekIndex) => (
                  <motion.div
                    key={weekIndex}
                    variants={columnVariants}
                    className="flex flex-col gap-[3px]"
                  >
                    {week.map((cell, dayIndex) => (
                      <HeatCell
                        key={dayIndex}
                        day={cell}
                        isHovered={hover?.day.date === cell?.date}
                        onEnter={(day, rect) =>
                          setHover({
                            day,
                            x: rect.left + rect.width / 2,
                            y: rect.top,
                          })
                        }
                        onLeave={() => setHover(null)}
                      />
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Floating tooltip */}
      {hover && (
        <div
          className="pointer-events-none fixed z-[60]"
          style={{ left: hover.x, top: hover.y - 12, transform: 'translate(-50%, -100%)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.14 }}
            className="whitespace-nowrap rounded-lg border border-[color:var(--border)] bg-[color:var(--card)] px-3 py-2 text-xs shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
          >
            <p className="font-semibold text-foreground">{tooltipCount(hover.day.count, lang)}</p>
            <p className="mt-0.5 text-[color:var(--muted-foreground)]">
              {fullDateFormat.format(new Date(`${hover.day.date}T12:00:00`))}
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

interface HeatCellProps {
  day: Cell
  isHovered: boolean
  onEnter: (day: ContributionDay, rect: DOMRect) => void
  onLeave: () => void
}

function HeatCell({ day, isHovered, onEnter, onLeave }: HeatCellProps) {
  if (!day) return <div className="h-3 w-3" aria-hidden />

  return (
    <div
      onMouseEnter={(event) => onEnter(day, event.currentTarget.getBoundingClientRect())}
      onMouseLeave={onLeave}
      className="h-3 w-3 rounded-[2px]"
      style={{
        backgroundColor: cellColor(day.level),
        cursor: 'pointer',
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        ...(isHovered
          ? {
              transform: 'scale(1.45)',
              position: 'relative',
              zIndex: 20,
              boxShadow:
                '0 0 0 1.5px var(--accent), 0 0 12px 1px color-mix(in srgb, var(--accent) 60%, transparent)',
            }
          : null),
      }}
    />
  )
}

function tooltipCount(count: number, lang: Locale): string {
  if (count === 0) return t(lang, 'sections.github.heatmap.tooltipNone')
  if (count === 1) return t(lang, 'sections.github.heatmap.tooltipOne')
  return fmt(t(lang, 'sections.github.heatmap.tooltip'), {
    n: new Intl.NumberFormat(lang).format(count),
  })
}

function Legend({ lang }: { lang: Locale }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-[color:var(--muted-foreground)]">
      <span>{t(lang, 'sections.github.heatmap.less')}</span>
      <div className="flex gap-[3px]">
        {([0, 1, 2, 3, 4] as ContributionLevel[]).map((level) => (
          <span
            key={level}
            className="h-3 w-3 rounded-[2px]"
            style={{ backgroundColor: cellColor(level) }}
          />
        ))}
      </div>
      <span>{t(lang, 'sections.github.heatmap.more')}</span>
    </div>
  )
}
