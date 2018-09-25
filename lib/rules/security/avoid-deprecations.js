const BaseChecker = require('./../base-checker')

class AvoidDeprecationsChecker extends BaseChecker {
  exitIdentifier(ctx) {
    const identifier = ctx.Identifier().toString()

    if (identifier === 'sha3') {
      this.error(ctx, 'avoid-sha3', 'Use "keccak256" instead of deprecated "sha3"')
    }

    if (identifier === 'suicide') {
      this.error(ctx, 'avoid-suicide', 'Use "selfdestruct" instead of deprecated "suicide"')
    }
  }

  exitThrowStatement(ctx) {
    this.error(ctx, 'avoid-throw', '"throw" is deprecated, avoid to use it')
  }
}

module.exports = AvoidDeprecationsChecker
