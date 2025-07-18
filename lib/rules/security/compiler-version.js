const semver = require('semver')
const BaseChecker = require('../base-checker')
const { severityDescription } = require('../../doc/utils')

const ruleId = 'compiler-version'

const DEFAULT_SEVERITY = 'error'
const DEFAULT_SEMVER = '^0.8.24'
const DESCRIPTION = `Compiler version must satisfy a semver requirement at least ${DEFAULT_SEMVER}.`

const meta = {
  type: 'security',

  docs: {
    description: DESCRIPTION,
    category: 'Security Rules',
    options: [
      {
        description: severityDescription,
        default: DEFAULT_SEVERITY,
      },
      {
        description: `Semver requirement`,
        default: DEFAULT_SEMVER,
      },
    ],
  },

  recommended: true,
  defaultSetup: [DEFAULT_SEVERITY, DEFAULT_SEMVER],

  schema: {
    type: 'string',
    description: DESCRIPTION + ' And have a Semver format.',
  },
}

class CompilerVersionChecker extends BaseChecker {
  constructor(reporter, config) {
    super(reporter, ruleId, meta)

    this.requirement =
      (config && config.getStringFromArray(ruleId, DEFAULT_SEMVER)) || DEFAULT_SEMVER
  }

  SourceUnit(node) {
    const hasPragmaDirectiveDef = node.children.some(
      (curItem) => curItem.type === 'PragmaDirective'
    )

    if (!hasPragmaDirectiveDef) {
      this.warn(node, 'Compiler version must be declared ')
    }
  }

  PragmaDirective(node) {
    if (
      node.name === 'solidity' &&
      !semver.satisfies(semver.minVersion(node.value), this.requirement)
    ) {
      this.warn(
        node,
        `Compiler version ${node.value} does not satisfy the ${this.requirement} semver requirement`
      )
    }
  }
}

module.exports = CompilerVersionChecker
