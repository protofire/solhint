const BaseChecker = require('./../base-checker')

class AvoidCallValueChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'avoid-call-value')
  }

  exitExpression(ctx) {
    this.validateCallValue(ctx)
  }

  validateCallValue(ctx) {
    if (ctx.getText().endsWith('.call.value')) {
      this.error(ctx, 'Avoid to use ".call.value()()"')
    }
  }
}

module.exports = AvoidCallValueChecker
