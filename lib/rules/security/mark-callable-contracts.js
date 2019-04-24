const TreeTraversing = require('./../../common/tree-traversing')
const Reporter = require('./../../reporter')

const traversing = new TreeTraversing()
const SEVERITY = Reporter.SEVERITY

const ruleId = 'mark-callable-contracts'
const meta = {
  type: 'security',

  docs: {
    description: `Explicitly mark all external contracts as trusted or untrusted.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',

  schema: []
}

class MarkCallableContractsChecker {
  constructor(reporter) {
    this.reporter = reporter
    this.ruleId = ruleId
    this.meta = meta
  }

  exitIdentifier(ctx) {
    const identifier = ctx.getText()
    const isFirstCharUpper = /[A-Z]/.test(identifier[0])
    const isContainsTrustInfo = identifier.toLowerCase().includes('trust')
    const isStatement = traversing.findParentType(ctx, 'StatementContext')

    if (isFirstCharUpper && !isContainsTrustInfo && isStatement) {
      this.reporter.addMessage(
        ctx.getSourceInterval(),
        SEVERITY.WARN,
        'Explicitly mark all external contracts as trusted or untrusted',
        this.ruleId
      )
    }
  }
}

module.exports = MarkCallableContractsChecker
