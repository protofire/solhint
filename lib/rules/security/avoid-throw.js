const BaseChecker = require('./../base-checker')

class AvoidThrowChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'avoid-throw')
  }

  exitThrowStatement(ctx) {
    this.error(ctx, '"throw" is deprecated, avoid to use it')
  }
}

module.exports = AvoidThrowChecker
