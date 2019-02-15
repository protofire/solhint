const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - visibility-modifier-order', () => {
  it('should raise visibility modifier error', () => {
    const code = contractWith('function a() ownable() public payable {}')

    const report = linter.processStr(code, {
      rules: { 'visibility-modifier-order': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Visibility'))
  })
})
