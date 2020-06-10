module.exports = {
  extends: 'airbnb-base',
  rules: {
    'comma-dangle': ['error', 'never'],
    'no-console': 'off',
    semi: ['error', 'never']
  },
  env: {
    jest: true
  }
}
