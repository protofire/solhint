const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('../../common/asserts')
const linter = require('../../../lib/index')
const { contractWith } = require('../../common/contract-builder')

describe('Linter - payable-fallback', () => {
  it('should raise warn when fallback is not payable and no receive function is present', () => {
    const code = contractWith('function() public {}')

    const report = linter.processStr(code, {
      rules: { 'payable-fallback': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'payable')
  })

  it('should not raise warn when fallback is payable and no receive function is present', () => {
    const code = contractWith('fallback() public payable {}')

    const report = linter.processStr(code, {
      rules: { 'payable-fallback': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not raise warn when fallback is not payable but receive function is present', () => {
    const code = contractWith('fallback() external {} receive() {}')

    const report = linter.processStr(code, {
      rules: { 'payable-fallback': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not raise warn when fallback is payable and receive function is present', () => {
    const code = contractWith('fallback() external payable {} receive() {}')

    const report = linter.processStr(code, {
      rules: { 'payable-fallback': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should ignore non-fallback functions', () => {
    const code = contractWith('function f() {} function g() payable {}')

    const report = linter.processStr(code, {
      rules: { 'payable-fallback': 'warn' },
    })

    assertNoWarnings(report)
  })
})
