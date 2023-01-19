const assert = require('assert')
const linter = require('./../../../lib/index')
const { assertErrorMessage } = require('./../../common/asserts')
const { funcWith } = require('./../../common/contract-builder')

describe('Linter - no-console', () => {
  it('should raise console.log() is not allowed', () => {
    const code = funcWith(`
      console.log('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'No console.logX statements')
  })

  it('should raise console.logString() is not allowed', () => {
    const code = funcWith(`
      console.logString('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'No console.logX statements')
  })

  it('should raise console.logBytes12() is not allowed', () => {
    const code = funcWith(`
      console.logString('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'No console.logX statements')
  })

  it('should raise hardhat import console.sol is not allowed', () => {
    const code = `
    import "hardhat/console.sol";
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'No import "hardhat/console.sol" or "forge-std/xxx" statement')
  })

  it('should raise hardhat import forge-std/xxx is not allowed', () => {
    const code = `
    import "forge-std/zarasa.sol";
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 'No import "hardhat/console.sol" or "forge-std/xxx" statement')
  })
})
