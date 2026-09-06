import { describe, expect, it } from "vitest"
import { registryEntrySchema } from "./registry-schema"

describe("registryEntrySchema", () => {
  it("accepts a minimal valid entry", () => {
    const result = registryEntrySchema.safeParse({
      id: "subagent-activity",
      repo: "mcowger/paseo-plugins",
      path: "subagent-activity",
    })
    expect(result.success).toBe(true)
  })

  it("defaults categories, platforms, and caveats to empty arrays", () => {
    const result = registryEntrySchema.parse({
      id: "skills",
      repo: "gpambrozio/paseo-plugins",
    })
    expect(result.categories).toEqual([])
    expect(result.platforms).toEqual([])
    expect(result.caveats).toEqual([])
  })

  it("accepts a declared platform restriction and caveats", () => {
    const result = registryEntrySchema.safeParse({
      id: "launchd-jobs",
      repo: "gpambrozio/paseo-plugins",
      path: "launchd-jobs",
      platforms: ["macos"],
      caveats: [
        "Requires a login session; won't run from a headless SSH-only daemon",
      ],
    })
    expect(result.success).toBe(true)
  })

  it("rejects an unknown platform", () => {
    const result = registryEntrySchema.safeParse({
      id: "plugin",
      repo: "owner/repo",
      platforms: ["freebsd"],
    })
    expect(result.success).toBe(false)
  })

  it("rejects more than 6 caveats", () => {
    const result = registryEntrySchema.safeParse({
      id: "plugin",
      repo: "owner/repo",
      caveats: Array.from({ length: 7 }, (_, i) => `caveat ${i}`),
    })
    expect(result.success).toBe(false)
  })

  it("rejects a caveat over 140 characters", () => {
    const result = registryEntrySchema.safeParse({
      id: "plugin",
      repo: "owner/repo",
      caveats: ["x".repeat(141)],
    })
    expect(result.success).toBe(false)
  })

  it.each([
    { id: "Subagent-Activity" }, // uppercase
    { id: "sub_agent" }, // underscore
    { id: "-subagent" }, // leading hyphen
  ])("rejects a malformed id %o", (overrides) => {
    const result = registryEntrySchema.safeParse({
      repo: "owner/repo",
      ...overrides,
    })
    expect(result.success).toBe(false)
  })

  it("rejects a repo that isn't 'owner/repo'", () => {
    const result = registryEntrySchema.safeParse({
      id: "plugin",
      repo: "https://github.com/owner/repo",
    })
    expect(result.success).toBe(false)
  })

  it("rejects unknown fields", () => {
    const result = registryEntrySchema.safeParse({
      id: "plugin",
      repo: "owner/repo",
      description: "not allowed here — that's derived, not submitted",
    })
    expect(result.success).toBe(false)
  })
})
