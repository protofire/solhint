class BaseChecker {
  constructor(reporter, ruleId) {
    this.reporter = reporter
    this.ruleId = ruleId
  }

  error(ctx, message) {
    this.reporter.error(ctx, this.ruleId, message)
  }

  errorAt(line, column, message) {
    this.reporter.errorAt(line, column, this.ruleId, message)
  }

  warn(ctx, message) {
    this.reporter.warn(ctx, this.ruleId, message)
  }
}

module.exports = BaseChecker
