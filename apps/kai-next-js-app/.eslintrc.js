module.exports = {
  root: true,
  // This tells ESLint to load the config from `config/eslint-config-kai/nextjs`
  extends: ['kai/nextjs', 'kai/storybook'],
  parserOptions: {
    babelOptions: {
      presets: [require.resolve('next/babel')]
    }
  },
  settings: {
    next: {
      rootDir: './'
    }
  }
}
