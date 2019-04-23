const BaseChecker = require('./../base-checker')
const semver = require('semver')

const ruleId = 'compiler-gt'
const meta = {
  type: 'security',

  docs: {
    description: `Compiler version must be higher than a minimum.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: ['error', '0.4'],

  schema: [
    {
      type: 'array',
      items: [{ type: 'string' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class CompilerGTChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.minimum = (config && config.getString(ruleId, '0.4')) || '0.4'
  }

  exitVersionConstraint(ctx) {
    const versionNode =
      (this.isVersionOperator(ctx.children[0]) && ctx.children[1]) || ctx.children[0]

    if (!semver.satisfies(versionNode.getText(), `^${this.minimum}`)) {
      this.error(ctx, `Use at least '${this.minimum}' compiler version`)
    }
  }

  isVersionOperator(ctx) {
    return ctx.constructor.name.includes('VersionOperator')
  }
}

module.exports = CompilerGTChecker
