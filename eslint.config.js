import config from '@shcherbin/eslint-config'

export default [
  ...config.nodeTypescript,
  {
    rules: {
      'no-console': 'off'
    }
  },
  {
    ignores: [
      'tests/**/*.ts'
    ]
  }
]
