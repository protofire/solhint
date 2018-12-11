const BaseChecker = require('./../base-checker')

const FROBIDDEN_NAMES = ['I', 'l', 'O']

class UseForbiddenNameChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'use-forbidden-name')
  }

  exitIdentifier(ctx) {
    const text = ctx.getText()

    if (FROBIDDEN_NAMES.includes(text)) {
      this.error(ctx, "Avoid to use letters 'I', 'l', 'O' as identifiers")
    }
  }
}

module.exports = UseForbiddenNameChecker
