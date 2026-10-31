import { cn } from '@/lib/utils'

interface LogoProps {
  /** Logo height in px. The mark is square; the wordmark scales with it. */
  size?: number
  className?: string
  withMark?: boolean
}

const VIEWBOX = 32

export function Logo({ size = 32, className, withMark = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Emre Paça logo"
      >
        <g
          stroke="currentColor"
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Lowercase "e": crossbar, then a bowl that opens bottom-right */}
          <path d="M5 16 H21.5 A8.25 8.25 0 1 0 17.5 23.2" />
          {/* Signature leg: drops from the crossbar's end, like a pen stroke finishing the letter */}
          <path d="M21.5 16 Q23.5 25 28 28.5" />
        </g>
      </svg>
      {withMark && (
        <span
          className="font-brand font-semibold leading-none tracking-[-0.03em]"
          style={{ fontSize: Math.round(size * 0.82) }}
        >
          Emre Paça
        </span>
      )}
    </span>
  )
}
