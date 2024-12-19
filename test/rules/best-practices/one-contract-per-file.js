const { assertNoWarnings, assertErrorMessage, assertErrorCount } = require('../../common/asserts')
const linter = require('../../../lib/index')
const contracts = require('../../fixtures/best-practices/one-contract-per-file')

describe('Linter - one-contract-per-file', () => {
  it('should not raise error for ONE contract only', () => {
    const code = contracts.ONE_CONTRACT

    const report = linter.processStr(code, {
      rules: { 'one-contract-per-file': 'error' },
    })

    assertNoWarnings(report)
  })

  it('should not raise error for ONE contract and multiple interfaces in the same file', () => {
    const code = contracts.ONE_CONTRACT_WITH_INTERFACES

    const report = linter.processStr(code, {
      rules: { 'one-contract-per-file': 'error' },
    })

    assertNoWarnings(report)
  })

  it('should not raise error for ONE library and multiple interfaces in the same file', () => {
    const code = contracts.ONE_LIBRARY_WITH_INTERFACES

    const report = linter.processStr(code, {
      rules: { 'one-contract-per-file': 'error' },
    })

    assertNoWarnings(report)
  })

  it('should raise error for TWO contracts in same file', () => {
    const code = contracts.TWO_CONTRACTS

    const report = linter.processStr(code, {
      rules: { 'one-contract-per-file': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Found more than One contract per file. 2 contracts found!')
  })

  it('should raise error for THREE contracts in same file', () => {
    const code = contracts.THREE_CONTRACTS

    const report = linter.processStr(code, {
      rules: { 'one-contract-per-file': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Found more than One contract per file. 3 contracts found!')
  })

  it('should raise error for TWO libraries in same file', () => {
    const code = contracts.TWO_LIBRARIES

    const report = linter.processStr(code, {
      rules: { 'one-contract-per-file': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Found more than One contract per file. 2 contracts found!')
  })
})
