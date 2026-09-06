//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config"

export default [
  ...tanstackConfig,
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
  {
    // .output is Nitro's build output (see vite.config.ts / zerops.yaml) —
    // not covered by the shared config's default ignores like `dist` is.
    ignores: ["eslint.config.js", ".prettierrc", ".output/**"],
  },
]
