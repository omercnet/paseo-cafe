/** Pure, best-effort markdown README parsing shared by scripts/scan.ts and its tests. */

/** Strip markdown noise (headings, badges, images) and return the first real paragraph. */
export function firstParagraph(readme: string): string | undefined {
  const lines = readme.split("\n")
  const buffer: string[] = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed === "") {
      if (buffer.length > 0) break
      continue
    }
    if (trimmed.startsWith("#")) continue
    if (/^\[!\[/.test(trimmed)) continue // badge rows
    if (/^<img/i.test(trimmed) || /^<p align/i.test(trimmed)) continue
    buffer.push(trimmed)
  }
  const text = buffer.join(" ").trim()
  return text.length > 0 ? text.slice(0, 400) : undefined
}

const MAX_SECTION_LENGTH = 1500

/**
 * Everything under the first heading whose *own* text matches `headingPattern`
 * (not a substring match — "Uninstalling" won't match an "install" pattern),
 * up to the next heading at the same or a shallower level.
 */
function extractSectionByHeading(
  readme: string,
  headingPattern: RegExp
): string | undefined {
  const lines = readme.split("\n")
  let capturing = false
  let capturedLevel = 0
  const buffer: string[] = []

  for (const line of lines) {
    const headingMatch = /^(#{1,4})\s+(.*)$/.exec(line)
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      if (capturing && level <= capturedLevel) break
      if (!capturing && headingPattern.test(text)) {
        capturing = true
        capturedLevel = level
        continue
      }
    }
    if (capturing) buffer.push(line)
  }

  const text = buffer.join("\n").trim()
  if (!text) return undefined
  return text.length > MAX_SECTION_LENGTH
    ? `${text.slice(0, MAX_SECTION_LENGTH)}…`
    : text
}

const INSTALL_HEADING =
  /^(install(?:ation|ing)?|setup|getting started|quick ?start)$/i

/**
 * Best-effort extraction of an "Install"/"Setup"/"Getting started" section
 * from a README. Deliberately supplementary — the always-correct install
 * command comes from src/lib/install-command.ts, not from this parsing.
 */
export function extractInstallSection(readme: string): string | undefined {
  return extractSectionByHeading(readme, INSTALL_HEADING)
}

const LIMITATIONS_HEADING = /^(limitations?|caveats?|known issues?|gotchas?)$/i

/**
 * Best-effort extraction of a "Limitations"/"Caveats"/"Known issues" README
 * section — the free, deterministic first line of defense for surfacing
 * things like "macOS only" without needing an LLM. An author's own
 * `platforms`/`caveats` in their registry entry (src/lib/registry-schema.ts)
 * is authoritative when present; this is the fallback for everyone who
 * didn't declare it there but did write it in their README.
 */
export function extractLimitationsSection(readme: string): string | undefined {
  return extractSectionByHeading(readme, LIMITATIONS_HEADING)
}
