const BaseChecker = require('../base-checker')

const ruleId = 'strict-import'
const meta = {
  type: 'best-practices',

  docs: {
    description: 'Check that all imports are specific about what they import',
    category: 'Best Practice Rules',
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class StrictImportInterface extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  SourceUnit(node) {
    for (let i = 0; node.children && i < node.children.length; i++) {
      const curItem = node.children[i]

      if (curItem.type === 'ImportDirective' && curItem.symbolAliases === null) {
        this.error(
          node,
          `Import from "${curItem.path}" must specify interface, library or contract imported`
        )
      }
    }
  }
}

module.exports = StrictImportInterface
