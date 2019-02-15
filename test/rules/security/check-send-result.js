const assert = require('assert')
const linter = require('./../../../lib/index')
const funcWith = require('./../../common/contract-builder').funcWith

describe('Linter - check-send-result', () => {
  it('should return "send" call verification error', () => {
    const code = funcWith('x.send(55);')

    const report = linter.processStr(code, {
      rules: { 'check-send-result': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('send'))
  })
})
