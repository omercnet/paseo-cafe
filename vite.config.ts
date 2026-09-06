import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    // Bundles the SSR build into a single self-contained server at
    // .output/server/index.mjs (deps inlined, no node_modules needed at
    // runtime) — what Zerops actually deploys and runs. See zerops.yaml.
    nitro(),
  ],
})

export default config
