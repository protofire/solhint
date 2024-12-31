const BaseChecker = require('../base-checker')
const naming = require('../../common/identifier-naming')

const ruleId = 'contract-name-capwords'
const meta = {
  type: 'naming',

  docs: {
    description: 'Contract, Structs and Enums should be in CapWords.',
    category: 'Style Guide Rules',
    notes: [
      {
        note: 'Solhint allows this rule to automatically fix the code with `--fix` option',
      },
      {
        note: 'The FIX will only change first letter and remove underscores',
      },
    ],
  },

  isDefault: false,
  recommended: true,
  defaultSetup: 'warn',
  fixable: true,
  schema: null,
}

class ContractNameCapWordsChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  ContractDefinition(node) {
    this.validateName(node, 'contract')
  }

  EnumDefinition(node) {
    this.validateName(node, 'enum')
  }

  StructDefinition(node) {
    this.validateName(node, 'struct')
  }

  validateName(node, type) {
    if (naming.isNotCapWords(node.name)) {
      this._error(node, type)
    }
  }

  fixStatement(node, type) {
    // Remove leading and trailing underscores
    let nameToPut = node.name.replace(/^[_]+|[_]+$/g, '')

    // Replace '-' with space and split the string into an array
    let words = nameToPut.replace(/-/g, ' ').split('_')

    // Capitalize the first letter of each word
    words = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1))

    // Join the words back into a single string
    nameToPut = words.join('')

    const originalNameLength = node.name.length
    const typeLength = type.length

    const rangeStart = node.range[0] + typeLength + 1
    const rangeEnd = node.range[0] + typeLength + originalNameLength

    return (fixer) => fixer.replaceTextRange([rangeStart, rangeEnd], nameToPut)
  }

  _error(node, type) {
    this.error(
      node,
      'Contract, Structs and Enums should be in CapWords',
      this.fixStatement(node, type)
    )
  }
}

module.exports = ContractNameCapWordsChecker
