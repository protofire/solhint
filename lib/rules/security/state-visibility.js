const BaseChecker = require('./../base-checker')

class StateVisibilityChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'state-visibility')
  }

  exitStateVariableDeclaration(ctx) {
    const text = ctx.getText()

    const hasInternal = text.includes('internal')
    const hasPrivate = text.includes('private')
    const hasPublic = text.includes('public')

    if (!hasInternal && !hasPrivate && !hasPublic) {
      this.warn(ctx, 'Explicitly mark visibility of state')
    }
  }
}

module.exports = StateVisibilityChecker
