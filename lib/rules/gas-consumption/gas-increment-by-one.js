/* eslint-disable */
const BaseChecker = require('../base-checker')

const ruleId = 'gas-increment-by-one'
const meta = {
  type: 'gas-consumption',

  docs: {
    description: 'Suggest increments by one, like this ++i instead of other type',
    category: 'Gas Consumption Rules',
    notes: [
      {
        note: '[source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (Incrementing/Decrementing By 1)',
      },
      {
        note: '[source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-8rekj) of the rule initiative',
      },
    ],
  },

  
  recommended: true,
  defaultSetup: 'warn',

  schema: null,
}

class GasIncrementByOne extends BaseChecker {
  constructor(reporter) {
    super(reporter, ruleId, meta)
  }

  UnaryOperation(node) {
    if (node.isPrefix) {
      // Ignore pre-increment and pre-decrement
      return
    }

    if (node.operator === '++' || node.operator === '--') {
      const variableName = this.extractVariableName(node.subExpression)
      if (variableName) {
        this.reportError(node, variableName)
      }
    }
  }

  BinaryOperation(node) {
    if (node.operator === '=' || node.operator === '+=' || node.operator === '-=') {
      const resultObject = this.isVariableIncrementOrDecrement(node.left, node.right, node.operator)
      if (resultObject.result) {
        this.reportError(node, resultObject.varName)
      }
    }
  }

  isVariableIncrementOrDecrement(left, right, operator) {
  const leftVar = this.extractVariableName(left)

  // assignment and operation
  if (operator === '+=' || operator === '-=') {
    const rightIsOne = right.type === 'NumberLiteral' && parseInt(right.number) === 1
    return { result: leftVar && rightIsOne, varName: leftVar }
  }

  // regular assignment
  if (operator === '=') {
    if (right.type !== 'BinaryOperation') return { result: false }

    const rightLeftVar = this.extractVariableName(right.left)
    const rightRightVar = this.extractVariableName(right.right)

    const isLeftOne = right.left.type === 'NumberLiteral' && parseInt(right.left.number) === 1
    const isRightOne = right.right.type === 'NumberLiteral' && parseInt(right.right.number) === 1

    const isIncrement =
      right.operator === '+' &&
      (
        (leftVar === rightLeftVar && isRightOne) || 
        (leftVar === rightRightVar && isLeftOne)
      )

    const isDecrement =
      right.operator === '-' &&
      leftVar === rightLeftVar &&
      isRightOne

    return { result: isIncrement || isDecrement, varName: leftVar }
  }

  return { result: false }
}


  extractVariableName(node) {
    if (node.type === 'Identifier') {
      return node.name
    } else if (node.type === 'MemberAccess') {
      return this.extractVariableName(node.expression) + '.' + node.memberName
    } else if (node.type === 'IndexAccess') {
      return this.extractVariableName(node.base)
    }
    return null
  }

  reportError(node, fullVariableName) {
    const variableName = fullVariableName.split('.')[0]
    this.error(
      node,
      `GC: For [ ${variableName} ] variable, increment/decrement by 1 using: [ ++variable ] to save gas`
    )
  }
}

module.exports = GasIncrementByOne