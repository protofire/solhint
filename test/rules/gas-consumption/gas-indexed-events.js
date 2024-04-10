const assert = require('assert')
const linter = require('../../../lib/index')
const { contractWith } = require('../../common/contract-builder')

const replaceErrorMsg = (variableName, eventName) => {
  return `GC: [${variableName}] on Event [${eventName}] could be Indexed`
}

describe('Linter - gas-indexed-events', () => {
  it('should raise error on amount and address', () => {
    const code = contractWith(
      'event LogEvent1(string message, bytes whatever, uint128 amount, address account);'
    )

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 2)
    assert.equal(report.messages[0].message, replaceErrorMsg('amount', 'LogEvent1'))
    assert.equal(report.messages[1].message, replaceErrorMsg('account', 'LogEvent1'))
  })

  it('should raise error on account', () => {
    const code = contractWith('event LogEvent2(ufixed account);')

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, replaceErrorMsg('account', 'LogEvent2'))
  })

  it('should raise error on amount and account', () => {
    const code = contractWith(
      'event LogEvent4(string indexed message, bytes indexed whatever, bool active, address account);'
    )

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 2)
    assert.equal(report.messages[0].message, replaceErrorMsg('active', 'LogEvent4'))
    assert.equal(report.messages[1].message, replaceErrorMsg('account', 'LogEvent4'))
  })

  it('should NOT raise error, all three indexed keyword are used', () => {
    const code = contractWith(
      'event LogEvent3(string indexed message, bytes indexed whatever, uint256 indexed amount, address account);'
    )

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error, all types are not for suggestion', () => {
    const code = contractWith(
      'event LogEvent3(string indexed message, bytes whatever, string message2);'
    )

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error, there are no arguments', () => {
    const code = contractWith('event LogEvent5();')

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error, all variables are indexed', () => {
    const code = contractWith('event Increment (address indexed sender, uint256 indexed value);')

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error, all variables are indexed or not for suggestion', () => {
    const code = contractWith('event Increment (address indexed sender, string whatever);')

    const report = linter.processStr(code, {
      rules: { 'gas-indexed-events': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
