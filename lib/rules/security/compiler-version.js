const semver = require('semver')
const BaseChecker = require('./../base-checker')

const ruleId = 'compiler-version'
const meta = {
  type: 'security',

  docs: {
    description: `Compiler version must satisfy a semver requirement.`,
    category: 'Security Rules'
  },

  isDefault: false,
  recommended: true,
  defaultSetup: ['error', '^0.5.7'],

  schema: [
    {
      type: 'array',
      items: [{ type: 'string' }],
      uniqueItems: true,
      minItems: 2
    }
  ]
}

class CompilerVersionChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.requirement = (config && config.getString(ruleId, '^0.5.8')) || '^0.5.8'
  }

  exitVersionConstraint(ctx) {
    const versionNode =
      (this.isVersionOperator(ctx.children[0]) && ctx.children[1]) || ctx.children[0]

    if (!semver.satisfies(versionNode.getText(), this.requirement)) {
      this.error(
        ctx,
        `Compiler version ${versionNode.getText()} does not satisfy the ${
          this.requirement
        } semver requirement`
      )
    }
  }

  isVersionOperator(ctx) {
    return ctx.constructor.name.includes('VersionOperator')
  }
}

module.exports = CompilerVersionChecker
