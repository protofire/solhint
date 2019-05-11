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
    this.structNames = []
  }

  enterStructDefinition(ctx) {
    this.gatherStructNames(ctx)
  }

  exitIdentifier(ctx) {
    const identifier = ctx.getText()
    const isFirstCharUpper = /[A-Z]/.test(identifier[0])
    const isContainsTrustInfo = identifier.toLowerCase().includes('trust')
    const isStatement = traversing.findParentType(ctx, 'StatementContext')

    if (
      isFirstCharUpper &&
      !isContainsTrustInfo &&
      isStatement &&
      !this.structNames.includes(identifier)
    ) {
      this.reporter.addMessage(
        ctx.getSourceInterval(),
        SEVERITY.WARN,
        'Explicitly mark all external contracts as trusted or untrusted',
        this.ruleId
      )
    }
  }

  gatherStructNames(ctx) {
    const identifier = ctx.children[1]
    const structName = identifier.getText()

    if (structName) {
      this.structNames.push(structName)
    }
  }
}

module.exports = MarkCallableContractsChecker
