const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - state-visibility', () => {
  it('should return required visibility error for state', () => {
    const code = contractWith('uint a;')

    const report = linter.processStr(code, {
      rules: { 'state-visibility': 'warn' }
    })

    assert.equal(report.warningCount, 1)
    assert.ok(report.reports[0].message.includes('visibility'))
  })
})
