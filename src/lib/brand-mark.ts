/**
 * The paseo.cafe mark, "Snail": a cup seen from above, the way you see it
 * once you have sat down at a cafe table. The rim and the swirl in the coffee
 * are one spiral line, a small loop makes the handle, and together they read
 * as a snail — the slowest stroller there is, and a natural companion to the
 * butterfly in paseo.sh's own mark.
 *
 * Drawn the way that mark is drawn — one continuous, bold, round-capped
 * line — without borrowing it. Kinship by language, not by quotation; the
 * name carries the relationship.
 *
 * This module is the single source of truth for the mark: the React header
 * component, the committed favicon/touch-icon rasters and the plugin's PNG
 * (scripts/build-icons.ts) and the Open Graph cards (scripts/og-image.tsx)
 * all draw from it. Keep it free of React, DOM and Node so both the website
 * and scripts can import it.
 */

/** oklch(0.289 0.059 42) — the website's --primary. */
export const BRAND_BROWN = "#432012"
/** oklch(0.948 0.041 88.8) — the website's --primary-foreground. */
export const BRAND_CREAM = "#f9edcf"

export const MARK_VIEWBOX = "0 0 100 100"

/** Line weight, in viewBox units. Roughly paseo.sh's weight relative to its mark. */
export const MARK_STROKE = 8.5
/**
 * Line weight for frames of 16px and under, where 8.5 lands on about one
 * pixel and smears. The usual favicon trade of fidelity for legibility.
 */
export const MARK_STROKE_SMALL = 11

/**
 * An Archimedean spiral as an SVG path: `turns` revolutions from radius `r0`
 * to `r1` around (cx, cy), starting at angle `a0` (radians, clockwise in SVG
 * space). Sampled finely enough that round joins read as a smooth curve.
 */
function spiralPath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  turns: number,
  a0: number,
  samples = 120
): string {
  const points: string[] = []
  for (let i = 0; i <= samples; i += 1) {
    const t = i / samples
    const angle = a0 + t * turns * Math.PI * 2
    const radius = r0 + (r1 - r0) * t
    points.push(
      `${(cx + radius * Math.cos(angle)).toFixed(1)} ${(cy + radius * Math.sin(angle)).toFixed(1)}`
    )
  }
  return `M${points.join("L")}`
}

/** Rim and crema in one line: 1.4 turns inward, starting where the handle meets the rim. */
export const RIM_PATH = spiralPath(44, 50, 33, 9, 1.4, -0.4)
/** The handle: a loop leaving the rim and rejoining it lower down. */
export const HANDLE_PATH = "M76 39C93 35 94 63 76 61"

/** Every stroke of the mark, in drawing order. Render with fill none, round caps and joins. */
export const MARK_PATHS: readonly string[] = [RIM_PATH, HANDLE_PATH]

export interface BrandMarkSvgOptions {
  /** Stroke color for the line. */
  ink: string
  /** Optional solid tile behind the mark, for favicons that must read on any tab bar. */
  background?: string
  /** Use the heavier line for 16px frames. */
  small?: boolean
  /** Accessible name, emitted as an SVG <title>. */
  title?: string
}

/** Standalone SVG markup for the mark, for files and scripts (not React). */
export function brandMarkSvg({
  ink,
  background,
  small = false,
  title,
}: BrandMarkSvgOptions): string {
  const tile = background
    ? `<rect width="100" height="100" fill="${background}"/>`
    : ""
  const name = title ? `<title>${title}</title>` : ""
  const width = small ? MARK_STROKE_SMALL : MARK_STROKE
  const paths = MARK_PATHS.map((d) => `<path d="${d}"/>`).join("")
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}">` +
    name +
    tile +
    `<g fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">` +
    paths +
    "</g></svg>\n"
  )
}
