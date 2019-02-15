const assert = require('assert')
const linter = require('./../../../lib/index')
const funcWith = require('./../../common/contract-builder').funcWith

describe('Linter - mark-callable-contracts', () => {
  it('should return error that external contract is not marked as trusted / untrusted', () => {
    const code = funcWith('Bank.withdraw(100);')

    const report = linter.processStr(code, {
      rules: { 'mark-callable-contracts': 'warn' }
    })

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('trusted'))
  })
})
