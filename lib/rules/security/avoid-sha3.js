const BaseChecker = require('./../base-checker')

class AvoidSha3Checker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'avoid-sha3')
  }

  exitIdentifier(ctx) {
    const identifier = ctx.Identifier().toString()

    if (identifier === 'sha3') {
      this.error(ctx, 'Use "keccak256" instead of deprecated "sha3"')
    }
  }
}

module.exports = AvoidSha3Checker
