const assert = require('assert')
const linter = require('./../../../lib/index')
const funcWith = require('./../../common/contract-builder').funcWith

describe('Linter - check-send-result', () => {
  it('should return "send" call verification error', () => {
    const code = funcWith(require('../../fixtures/security/send-result-ignored'))

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('send'))
  })

  it('should not return "send" call verification error', () => {
    const code = funcWith(require('../../fixtures/security/send-result-checked'))

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('do not emit error when a require is used', () => {
    const code = funcWith('require(x.send(1));')

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('do not emit error when a require is used upper in the tree', () => {
    const code = funcWith('require(!x.send(1));')

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('do not emit error when an assert is used', () => {
    const code = funcWith('assert(x.send(1));')

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('do not emit error when an assert is used upper in the tree', () => {
    const code = funcWith('assert(x.send(1) || something);')

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('emit error when an arbitrary function surrounds the expression', () => {
    const code = funcWith('f(x.send(1));')

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 1)
  })
})
