import { cn } from '@/lib/utils'

interface LogoProps {
  /** Logo height in px. Width is derived from the SVG's intrinsic aspect ratio. */
  size?: number
  className?: string
  withMark?: boolean
}

const VIEWBOX_W = 48
const VIEWBOX_H = 40
const ASPECT = VIEWBOX_W / VIEWBOX_H

export function Logo({ size = 32, className, withMark = false }: LogoProps) {
  const height = size
  const width = Math.round(size * ASPECT)

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="E self-closing tag monogram"
      >
        <g
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          {/* Opening bracket "<" */}
          <path d="M12 12 L6 20 L12 28" />

          {/* "E" — custom-drawn, geometric */}
          <path d="M16 12 L16 28" />
          <path d="M16 12 L25 12" />
          <path d="M16 20 L22 20" />
          <path d="M16 28 L25 28" />

          {/* Self-closing "/>" — slash + bracket as a paired delimiter */}
          <path d="M33 12 L28 28" />
          <path d="M36 12 L42 20 L36 28" />
        </g>
      </svg>
      {withMark && (
        <span className="font-semibold tracking-tight text-foreground">Emre Paça</span>
      )}
    </span>
  )
}
