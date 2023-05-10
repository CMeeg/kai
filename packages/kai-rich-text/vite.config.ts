/// <reference types="vite/client" />
/// <reference types="vitest" />

import { defineProject } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineProject({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node'
  }
})
