const BaseChecker = require('./../base-checker')

class CompilerFixedChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'compiler-fixed')
  }

  exitVersionOperator(ctx) {
    this.warn(ctx, 'Compiler version must be fixed')
  }
}

module.exports = CompilerFixedChecker
