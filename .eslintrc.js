module.exports = {
  parserOptions: {
    ecmaVersion: 8
  },
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es6: true,
    mocha: true
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  rules: {
    'no-console': 'off'
  }
}
