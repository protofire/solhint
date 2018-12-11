const BaseChecker = require('./../base-checker')
const naming = require('./../../common/identifier-naming')

class EventNameCamelcaseChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'event-name-camelcase')
  }

  exitEventDefinition(ctx) {
    const identifier = ctx.children[1]
    const text = identifier.getText()

    if (naming.isNotCamelCase(text)) {
      this.error(ctx, 'Event name must be in CamelCase')
    }
  }
}

module.exports = EventNameCamelcaseChecker
