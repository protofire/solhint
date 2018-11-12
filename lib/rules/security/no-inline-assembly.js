const BaseChecker = require('./../base-checker')

class NoInlineAssemblyChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'no-inline-assembly')
  }

  exitInlineAssemblyStatement(ctx) {
    this.error(ctx)
  }

  error(ctx) {
    const message = 'Avoid to use inline assembly. It is acceptable only in rare cases'
    this.warn(ctx, message)
  }
}

module.exports = NoInlineAssemblyChecker
