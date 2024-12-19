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
        note: 'This rule only works for expressions like this: [ j = j + 1 ] but will fail if the code is written like this: [ j = 1 + j ]',
      },
      {
        note: '[source 1](https://coinsbench.com/comprehensive-guide-tips-and-tricks-for-gas-optimization-in-solidity-5380db734404) of the rule initiative (Incrementing/Decrementing By 1)',
      },
      {
        note: '[source 2](https://www.rareskills.io/post/gas-optimization?postId=c9db474a-ff97-4fa3-a51d-fe13ccb8fe3b#viewer-8rekj) of the rule initiative',
      },
    ],
  },

  isDefault: false,
  recommended: false,
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
    let rightValue

    // asignment and operation
    if (operator === '+=' || operator === '-=') {
      rightValue = right.type === 'NumberLiteral' && parseInt(right.number) === 1
      return { result: leftVar && rightValue, varName: leftVar }
    }
    // regular asignment
    else if (operator === '=') {
      const rightVar = this.extractVariableName(right.left)
      rightValue =
        right.right && right.right.type === 'NumberLiteral' && parseInt(right.right.number) === 1
      return { result: leftVar === rightVar && rightValue, varName: leftVar }
    }

    return false
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

// SourceUnit(node) {
//   this.findVariableUpdates(node)
// }

// findVariableUpdates(node) {
//   if (node === null || typeof node !== 'object') {
//     return
//   }

//   // Check for assignment in a function body
//   if (node.type === 'FunctionDefinition') {
//     this.findVariableUpdates(node.body)
//     return
//   }

//   if (node.type === 'ExpressionStatement' && node.expression.type === 'BinaryOperation') {
//     const expr = node.expression
//     if (expr.operator === '=' || expr.operator === '+=' || expr.operator === '-=') {
//       if (this.isVariableIncrementOrDecrement(expr.left, expr.right, expr.operator)) {
//         this.reportError(node, this.extractVariableName(expr.left))
//       }
//     }
//   }

//   Object.values(node).forEach((value) => {
//     if (typeof value === 'object') {
//       this.findVariableUpdates(value)
//     }
//   })
// }

// isVariableIncrementOrDecrement(left, right, operator) {
//   const leftVar = this.extractVariableName(left)
//   let rightVar, rightValue

//   if (operator === '+=' || operator === '-=') {
//     // For compound assignment, the operation is directly on the variable
//     rightValue = right.type === 'NumberLiteral' && parseInt(right.number) === 1
//     return leftVar && rightValue
//   } else if (operator === '=') {
//     rightVar = this.extractVariableName(right.left)
//     rightValue =
//       right.right && right.right.type === 'NumberLiteral' && parseInt(right.right.number) === 1
//     return leftVar === rightVar && rightValue
//   }

//   return false
// }
