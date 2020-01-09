class BaseChecker {
  constructor(reporter, ruleId, meta) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
  }

  error(ctx, message, fix) {
    this.addReport('error', ctx, message, fix)
  }

  errorAt(line, column, message, fix) {
    this.error({ loc: { start: { line, column } } }, message, fix)
  }

  warn(ctx, message, fix) {
    this.addReport('warn', ctx, message, fix)
  }

  addReport(type, ctx, message, fix) {
    this.reporter[type](ctx, this.ruleId, message, this.meta.fixable ? fix : null)
  }
}

module.exports = BaseChecker
