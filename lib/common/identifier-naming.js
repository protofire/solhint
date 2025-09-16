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

  isCapWords(text) {
    return match(text, /[A-Z$]+[a-zA-Z0-9$]*/)
  },

  isNotCapWords(text) {
    return !this.isCapWords(text)
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

  isFoundryTestCase(text) {
    // PREVIOUS VERSION
    // → strict version: requires that after `test...` the first character must be uppercase (CamelCase enforced)
    // const regexTest = /^test(Fork)?(Fuzz)?(Fail)?(_)?[A-Z](Revert(If_|When_){1})?\w{1,}$/
    // PREVIOUS VERSION
    // → strict version: requires that after `invariant` or `statefulFuzz` the first character must be uppercase (CamelCase enforced)
    // const regexInvariant = /^(invariant|statefulFuzz)(_)?[A-Z]\w{1,}$/

    // this one checks test functions with optional suffixes (Fork, Fuzz, Fail, RevertIf_, RevertWhen_, etc.)
    // now it only requires that after those, at least one word character exists (no CamelCase enforcement)
    const regexTest = /^test(Fork)?(Fuzz)?(Fail)?(_)?(Revert(If_|When_){1})?\w{1,}$/
    const matchRegexTest = match(text, regexTest)

    // this one checks invariant or statefulFuzz functions, with optional underscore,
    // followed by at least one word character (no CamelCase enforcement)
    const regexInvariant = /^(invariant|statefulFuzz)(_)?\w{1,}$/
    const matchRegexInvariant = match(text, regexInvariant)

    return matchRegexTest || matchRegexInvariant
  },
}
