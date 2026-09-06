import { describe, expect, it } from "vitest"
import {
  extractInstallSection,
  extractLimitationsSection,
  firstParagraph,
} from "./readme"

describe("firstParagraph", () => {
  it("skips headings, badges, and images to find the first real paragraph", () => {
    const readme = [
      "# My Plugin",
      "[![CI](https://example.com/badge.svg)](https://example.com)",
      '<img src="logo.png" />',
      "",
      "This plugin does a useful thing.",
      "It spans two lines.",
      "",
      "More text that shouldn't be included.",
    ].join("\n")
    expect(firstParagraph(readme)).toBe(
      "This plugin does a useful thing. It spans two lines."
    )
  })

  it("returns undefined for an empty README", () => {
    expect(firstParagraph("")).toBeUndefined()
  })
})

describe("extractInstallSection", () => {
  it("captures content under an Install heading up to the next sibling heading", () => {
    const readme = [
      "# My Plugin",
      "",
      "## Install",
      "",
      "```bash",
      "paseo plugin add someone/my-plugin",
      "```",
      "",
      "## Usage",
      "",
      "Open the command center.",
    ].join("\n")
    expect(extractInstallSection(readme)).toBe(
      "```bash\npaseo plugin add someone/my-plugin\n```"
    )
  })

  it("stops at a sibling heading but keeps deeper subheadings", () => {
    const readme = [
      "## Installation",
      "### Prerequisites",
      "Requires the CLI.",
      "### Plugin install",
      "```bash",
      "paseo plugin add owner/repo",
      "```",
      "## Usage",
      "Not included.",
    ].join("\n")
    const section = extractInstallSection(readme)
    expect(section).toContain("Prerequisites")
    expect(section).toContain("paseo plugin add owner/repo")
    expect(section).not.toContain("Not included")
  })

  it("does not treat an Uninstall heading as an Install section", () => {
    const readme = ["## Uninstalling", "Run `paseo plugin remove`."].join("\n")
    expect(extractInstallSection(readme)).toBeUndefined()
  })

  it("returns undefined when there is no matching heading", () => {
    const readme = [
      "## Overview",
      "Just a description, no setup section.",
    ].join("\n")
    expect(extractInstallSection(readme)).toBeUndefined()
  })
})

describe("extractLimitationsSection", () => {
  // Modeled on the real gpambrozio/paseo-plugins/launchd-jobs README, which
  // is exactly the motivating case: a plugin with a real, important
  // restriction (macOS only) stated under a dedicated heading.
  it("captures a real-world Limitations section", () => {
    const readme = [
      "# launchd-jobs",
      "",
      "## Install",
      "npm install",
      "",
      "## Limitations",
      "",
      "- macOS only. A daemon on Linux would need a systemd user timer backend, which does not exist here.",
      "- The daemon has to run inside your login session.",
      "",
      "## License",
      "MIT",
    ].join("\n")
    const section = extractLimitationsSection(readme)
    expect(section).toContain("macOS only")
    expect(section).not.toContain("npm install")
    expect(section).not.toContain("MIT")
  })

  it("also matches Caveats, Known issues, and Gotchas headings", () => {
    expect(extractLimitationsSection("## Caveats\nOne thing to know.")).toBe(
      "One thing to know."
    )
    expect(extractLimitationsSection("## Known issues\nA bug exists.")).toBe(
      "A bug exists."
    )
    expect(extractLimitationsSection("## Gotchas\nWatch out.")).toBe(
      "Watch out."
    )
  })

  it("returns undefined when there is no matching heading", () => {
    expect(
      extractLimitationsSection("## Overview\nEverything works great.")
    ).toBeUndefined()
  })
})
