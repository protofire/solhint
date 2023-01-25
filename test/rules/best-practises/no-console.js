const assert = require('assert')
const linter = require('../../../lib/index')
const { assertErrorMessage } = require('../../common/asserts')
const { funcWith } = require('../../common/contract-builder')

const FUNCTION_CALL_ERROR = 'No console.logX or console2.log statements'
const IMPORT_ERROR = 'No import "hardhat/console.sol" or "forge-std/console.sol" statements'

describe('Linter - no-console', () => {
  it('should raise console.log() is not allowed', () => {
    const code = funcWith(`
      console.log('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, FUNCTION_CALL_ERROR)
  })

  it('should raise console.logString() is not allowed', () => {
    const code = funcWith(`
      console.logString('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, FUNCTION_CALL_ERROR)
  })

  it('should raise console.logBytes12() is not allowed', () => {
    const code = funcWith(`
      console.logString('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, FUNCTION_CALL_ERROR)
  })

  it('should raise console2.log is not allowed', () => {
    const code = funcWith(`
      console2.log('test');
    `)

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, FUNCTION_CALL_ERROR)
  })

  it('should raise hardhat import/console.sol is not allowed', () => {
    const code = `
    import "hardhat/console.sol";
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, IMPORT_ERROR)
  })

  it('should raise foundry forge-std/console.sol is not allowed', () => {
    const code = `
    import "forge-std/console.sol";
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, IMPORT_ERROR)
  })

  it('should raise foundry import forge-std/console2.sol is not allowed', () => {
    const code = `
    import "forge-std/console2.sol";
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, IMPORT_ERROR)
  })

  it('should NOT raise error to foundry import forge-std/otherThing.sol', () => {
    const code = `
    import "forge-std/xxxxx.sol";
    contract A {}
    `

    const report = linter.processStr(code, {
      rules: { 'no-console': ['error'] },
    })

    assert.equal(report.errorCount, 0)
  })
})
