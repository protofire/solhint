const BaseChecker = require('../base-checker')
const { isFallbackFunction } = require('../../common/ast-types')
const { isArray } = require('lodash')
const DEFAULT_IGNORE_CONSTRUCTORS = false
const DEFAULT_OPTION = { ignoreConstructors: DEFAULT_IGNORE_CONSTRUCTORS }
const config = require('../../config')

const ruleId = 'no-empty-blocks'
const meta = {
  type: 'best-practises',

  docs: {
    description: 'Code contains empty block.',
    category: 'Best Practise Rules',
    options: [
      {
        description:
          'A JSON object with a single property "ignoreConstructors" specifying if the rule should ignore constructors.',
        default: JSON.stringify(DEFAULT_OPTION),
      },
    ],
  },

  isDefault: false,
  recommended: true,
  defaultSetup: ['warn', DEFAULT_OPTION],

  schema: {
    type: 'object',
    properties: {
      ignoreConstructors: {
        type: 'boolean',
      },
    },
  },
}

class NoEmptyBlocksChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)

    if (reporter) {
      const conf = config.from({ rules: reporter.config })
      this.ignoreConstructors = conf.getObjectPropertyBoolean(ruleId, 'ignoreConstructors', false)
    }
  }

  ContractDefinition(node) {
    this.isAssemblyFor = false
    this._validateContractPartsCount(node)
  }

  FunctionDefinition(node) {
    node.body.isConstructor = node.isConstructor
  }

  Block(node) {
    if (node.isConstructor && this.ignoreConstructors) {
      return
    }
    const isFallbackFunctionBlock = isFallbackFunction(node.parent)
    if (isFallbackFunctionBlock) {
      // ignore empty blocks in fallback functions
      return
    }
    this._validateChildrenCount(node, 'statements')
  }

  StructDefinition(node) {
    this._validateChildrenCount(node, 'members')
  }

  EnumDefinition(node) {
    this._validateChildrenCount(node, 'members')
  }

  AssemblyBlock(node) {
    if (!this.isAssemblyFor) {
      this._validateChildrenCount(node, 'operations')
    }
  }

  AssemblyFor(node) {
    this.isAssemblyFor = true
    const operationsCount = node.body.operations.length
    if (operationsCount === 0) this._error(node)
  }

  'AssemblyFor:exit'() {
    this.isAssemblyFor = false
  }

  _validateChildrenCount(node, children) {
    const blockChildrenCount = node[children].length

    if (blockChildrenCount === 0) {
      this._error(node)
    }
  }

  _validateContractPartsCount(node) {
    const contractPartCount = node.subNodes.length

    if (contractPartCount === 0) {
      this._error(node)
    }
  }

  _error(node) {
    this.warn(node, 'Code contains empty blocks')
  }
}

module.exports = NoEmptyBlocksChecker
