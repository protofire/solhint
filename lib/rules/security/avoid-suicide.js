const BaseChecker = require('./../base-checker')

class AvoidSuicideChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'avoid-suicide')
  }

  exitIdentifier(ctx) {
    const identifier = ctx.Identifier().toString()

    if (identifier === 'suicide') {
      this.error(ctx, 'Use "selfdestruct" instead of deprecated "suicide"')
    }
  }
}

module.exports = AvoidSuicideChecker
