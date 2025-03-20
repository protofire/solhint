const BaseChecker = require('../base-checker')

const ruleId = 'gas-small-strings'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'Keep strings smaller than 32 bytes',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: '[source](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-ck1vq) of the rule initiative',
      },
    ],
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: null,
}

class GasSmallStrings extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  FileLevelConstant(node) {
    let isLarger = false

    if (node.typeName.name === 'string') {
      isLarger = this.isStringLargerThan32Bytes(node.initialValue.value)
    }

    if (isLarger) {
      this.reportError(node)
    }
  }

  VariableDeclaration(node) {
    let isLarger = false

    if (node.parent.type === 'StateVariableDeclaration' && node.typeName.name === 'string') {
      isLarger = this.isStringLargerThan32Bytes(node.expression.value)
    }

    if (
      node.parent.type === 'StateVariableDeclaration' &&
      node.typeName.type === 'ArrayTypeName' &&
      node.typeName.baseTypeName.name === 'string'
    ) {
      let isComponentLarger = false
      const componentsSize = node.expression.components.length

      let i = 0
      while (i < componentsSize) {
        isComponentLarger = this.isStringLargerThan32Bytes(node.expression.components[i].value)
        i++
        if (isComponentLarger) {
          // update the result
          isLarger = true
          // if there is one larger this loop can be exited
          i = componentsSize + 1
        }
      }
    }

    if (node.parent.type === 'VariableDeclarationStatement' && node.typeName.name === 'string') {
      isLarger = this.isStringLargerThan32Bytes(node.parent.initialValue.value)
    }

    if (isLarger) {
      this.reportError(node)
    }
  }

  BinaryOperation(node) {
    let isLarger = false

    if (node.right.type === 'StringLiteral') {
      isLarger = this.isStringLargerThan32Bytes(node.right.value)
    }

    if (isLarger) {
      this.reportError(node)
    }
  }

  FunctionCall(node) {
    let isLarger = false
    let isArgumentLarger = false
    const argumentsSize = node.arguments.length

    let i = 0
    while (i < argumentsSize) {
      if (node.arguments[i].type === 'StringLiteral') {
        isArgumentLarger = this.isStringLargerThan32Bytes(node.arguments[i].value)
        if (isArgumentLarger) {
          // update the result
          isLarger = true
          // if there is one larger this loop can be exited
          i = argumentsSize
        }
      }
      i++
    }

    if (isLarger) {
      this.reportError(node)
    }
  }

  ReturnStatement(node) {
    let isLarger = false
    let isComponentLarger = false
    const componentsSize = node.expression.components.length

    let i = 0
    while (i < componentsSize) {
      if (
        node.expression.components[i].type === 'StringLiteral'
        // &&
        // node.parent.parent.returnParameters[i].typeName.name === 'string'
      ) {
        isComponentLarger = this.isStringLargerThan32Bytes(node.expression.components[i].value)
        if (isComponentLarger) {
          // update the result
          isLarger = true
          // if there is one larger this loop can be exited
          i = componentsSize
        }
      }
      i++
    }

    if (isLarger) {
      this.reportError(node)
    }
  }

  isStringLargerThan32Bytes(inputString) {
    if (inputString.startsWith('0x') && inputString.length === 42) {
      // Check if the input is a valid Ethereum address
      return false
    } else {
      // Convert the string to Buffer and get its byte length
      const byteLength = Buffer.from(inputString, 'utf8').length
      // Check if the byte length is greater than 32
      return byteLength > 32
    }
  }

  reportError(node) {
    this.error(node, 'GC: String exceeds 32 bytes')
  }
}

module.exports = GasSmallStrings
