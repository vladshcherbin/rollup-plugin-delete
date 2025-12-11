import config from '@shcherbin/eslint-config-node'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    extends: config,
    ignores: [
      'tests/**/*.ts'
    ],
    rules: {
      'no-console': 'off'
    }
  }
])
