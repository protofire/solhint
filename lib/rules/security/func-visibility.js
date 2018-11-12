const BaseChecker = require('./../base-checker')

class FuncVisibilityChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'func-visibility')
  }

  exitModifierList(ctx) {
    const text = ctx.getText()

    const hasInternal = text.includes('internal')
    const hasExternal = text.includes('external')
    const hasPrivate = text.includes('private')
    const hasPublic = text.includes('public')

    if (!hasExternal && !hasInternal && !hasPrivate && !hasPublic) {
      this.warn(ctx, 'Explicitly mark visibility in function')
    }
  }
}

module.exports = FuncVisibilityChecker
