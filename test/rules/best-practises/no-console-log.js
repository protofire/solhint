const assert = require('assert')
const linter = require('./../../../lib/index')
const { assertErrorMessage } = require('./../../common/asserts')
const { funcWith } = require('./../../common/contract-builder')

describe('Linter - no-console-log', () => {
  it('should raise console.log() is not allowed', () => {
    const code = funcWith(`
      console.log('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console-log': ['error'] }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'No console.log()')
  })

  it('should raise hardhat import console.sol is not allowed', () => {
    const code = `
      import "hardhat/console.sol";
      contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'no-console-log': ['error'] }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'No import "hardhat/console.sol"')
  })
})
