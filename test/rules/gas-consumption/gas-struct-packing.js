const assert = require('assert')
const { contractWith, multiLine } = require('../../common/contract-builder')
const linter = require('../../../lib/index')
const TEST_CASES = require('../../fixtures/gas-consumption/gas-struct-packing-data')

// const { contractWith, multiLine } = require('../../common/contract-builder')

const replaceErrorMsg = (variableName) => {
  const errMsg = `GC: For [ ${variableName} ] struct, packing seems inefficient. Try rearranging to achieve 32bytes slots`
  return errMsg
}

describe('Linter - gas-struct-packing', () => {
  for (const contract of TEST_CASES.contractStructsInefficient) {
    it(`should raise error for ${contract.name}`, () => {
      const code = contract.code
      const report = linter.processStr(code, {
        rules: { 'gas-struct-packing': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.equal(report.messages[0].message, replaceErrorMsg(contract.name))
    })
  }

  for (const contract of TEST_CASES.contractStructsEfficient) {
    it(`should NOT raise error for ${contract.name}`, () => {
      const code = contract.code
      const report = linter.processStr(code, {
        rules: { 'gas-struct-packing': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })
  }

  it(`REPORTED: should NOT raise error for MyStruct2`, () => {
    const code = contractWith(
      multiLine(
        // // Large Types Followed by Small Types
        'struct MyStruct2 {',
        '   address addr1;',
        '   address addr2;',
        '   address addr3;',
        '}'
      )
    )
    const report = linter.processStr(code, {
      rules: { 'gas-struct-packing': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
