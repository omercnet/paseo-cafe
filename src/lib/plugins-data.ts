import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { pluginRecordSchema } from "@/lib/plugin-schema"
import type { PluginRecord } from "@/lib/plugin-schema"
import plugins from "../../data/plugins.json"

// Statically imported rather than read off disk at request time: the CI
// pipeline (scan -> commit -> deploy, see .github/workflows/enrich-and-deploy.yml)
// always regenerates data/plugins.json *before* the app is built, so Vite/Nitro
// inline it straight into the server bundle at build time. That also makes the
// Zerops deploy self-contained — .output/ doesn't need the repo's data/
// directory alongside it at runtime, just this one bundled server file.
// createServerFn still keeps this out of the client bundle: only its RPC
// result crosses the wire, not the JSON module itself.
export const getPlugins = createServerFn({ method: "GET" }).handler(
  async (): Promise<PluginRecord[]> => {
    return z.array(pluginRecordSchema).parse(plugins)
  }
)
