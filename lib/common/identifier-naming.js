function match(text, regex) {
  return text.replace(regex, '').length === 0
}

module.exports = {
  isMixedCase(text) {
    return match(text, /[_]*[a-z$]+[a-zA-Z0-9$]*[_]?/)
  },

  isNotMixedCase(text) {
    return !this.isMixedCase(text)
  },

  isCamelCase(text) {
    return match(text, /[A-Z$]+[a-zA-Z0-9$]*/)
  },

  isNotCamelCase(text) {
    return !this.isCamelCase(text)
  },

  isUpperSnakeCase(text) {
    return match(text, /_{0,2}[A-Z0-9$]+[_A-Z0-9$]*/)
  },

  isNotUpperSnakeCase(text) {
    return !this.isUpperSnakeCase(text)
  },

  hasLeadingUnderscore(text) {
    return text && text[0] === '_'
  },

  isNotFoundryTestCase(text) {
    const regex = /^test(Fork)?(Fuzz)?(Fail)?_(Revert(If_|When_){1})?\w{1,}$/
    return !match(text, regex)
  },
}
