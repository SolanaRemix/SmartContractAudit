module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'script'
  },
  rules: {
    'no-undef': 'error'
  },
  ignorePatterns: ['node_modules/', 'reports/', 'node/bot/']
};
