import { MARK_PATHS, MARK_STROKE, MARK_VIEWBOX } from "@/lib/brand-mark"

/**
 * The paseo.cafe mark as inline SVG stroked in `currentColor`, so it follows
 * the theme wherever it sits. See src/lib/brand-mark.ts for the geometry.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={MARK_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
