function noIndent() {
  return {
    rules: {
      indent: false,
      'no-empty-blocks': false
    }
  }
}

function prettier() {
  return {
    rules: {
      'prettier/prettier': ['error'],
      indent: false,
      'no-empty-blocks': false,
      'two-lines-top-level-separator': false,
      'state-visibility': false,
      'separate-by-one-line-in-contract': false,
      'const-name-snakecase': false,
      'func-visibility': false,
      'compiler-fixed': false,
      'contract-name-camelcase': false,
      quotes: false
    }
  }
}
module.exports = { noIndent, prettier }
