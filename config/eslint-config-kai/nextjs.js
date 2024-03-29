module.exports = {
  extends: ['next/core-web-vitals', 'turbo', 'plugin:prettier/recommended'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'turbo/no-undeclared-env-vars': [
      'error',
      {
        allowList: ['^PRIVATE_.+$']
      }
    ]
  }
}
