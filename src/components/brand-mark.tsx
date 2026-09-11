import {
  CUP_PATH,
  LOOP_PATH,
  LOOP_TRANSFORM,
  MARK_VIEWBOX,
} from "@/lib/brand-mark"

/**
 * The paseo.cafe mark as inline SVG in `currentColor`, so it follows the
 * theme wherever it sits. See src/lib/brand-mark.ts for the geometry.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      className={className}
    >
      <path d={CUP_PATH} />
      <path d={LOOP_PATH} transform={LOOP_TRANSFORM} />
    </svg>
  )
}
