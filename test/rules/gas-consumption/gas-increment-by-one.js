const assert = require('assert')
const linter = require('../../../lib/index')
const { funcWith } = require('../../common/contract-builder')

const replaceErrorMsg = (variableName) => {
  const errMsg = `GC: For [ ${variableName} ] variable, increment/decrement by 1 using: [ ++variable ] to save gas`
  return errMsg
}

const RAISE_ERRORS = [
  {
    statement: 'myStringArray[0] = myStringArray[0] - 1;',
    varName: 'myStringArray',
  },
  {
    statement: 'customStruct.value = customStruct.value + 1;',
    varName: 'customStruct',
  },
  {
    statement: 'testMapping2[account].value = testMapping2[account].value + 1;',
    varName: 'testMapping2',
  },
  {
    statement: 'testMapping3[account][token].value = testMapping3[account][token].value + 1;',
    varName: 'testMapping3',
  },
  {
    statement: 'someArray[index]--;',
    varName: 'someArray',
  },
  {
    statement: 'anotherCounter++;',
    varName: 'anotherCounter',
  },
  {
    statement: 'balance1 += 1;',
    varName: 'balance1',
  },
  {
    statement: 'anotherVar -= 1;',
    varName: 'anotherVar',
  },
  // {
  //   statement:
  //     'complexMapping[user].balances[asset] = complexMapping[user].balances[asset] + 1 + someFunctionCall();',
  //   varName: 'complexMapping',
  // },
  // {
  //   statement: 'anotherMapping[user][token].count = anotherMapping[user][token].count - 1 + 5;',
  //   varName: 'anotherMapping',
  // },
]

const NOT_RAISE_ERRORS = [
  {
    statement: 'edgeCaseVar = edgeCaseVar * 2 + 1;',
    varName: 'edgeCaseVar',
  },
  {
    statement: 'bytes32 byteArray = byteArray + bytes32(1);',
    varName: 'byteArray',
  },
  {
    statement: '--balance1;',
    varName: 'balance1',
  },
  {
    statement: '++balance2;',
    varName: 'balance2',
  },
  {
    statement: 'someVar = someVar + 2;',
    varName: 'someVar',
  },
  {
    statement: 'unrelatedVar = someVar + 1;',
    varName: 'unrelatedVar',
  },
  {
    statement: 'uint256 result = someVar + 1;',
    varName: 'result',
  },
]

describe('Linter - gas-increment-by-one', () => {
  for (const result of RAISE_ERRORS) {
    it(`should raise error for ${result.varName}`, () => {
      const code = funcWith(result.statement)
      const report = linter.processStr(code, {
        rules: { 'gas-increment-by-one': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.equal(report.messages[0].message, replaceErrorMsg(result.varName))
    })
  }

  for (const result of NOT_RAISE_ERRORS) {
    it(`should NOT raise error for ${result.varName}`, () => {
      const code = funcWith(result.statement)
      const report = linter.processStr(code, {
        rules: { 'gas-increment-by-one': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })
  }
})
