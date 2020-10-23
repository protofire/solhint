const assert = require('assert')
const linter = require('./../../../lib/index')

describe('Linter - comprehensive-interface', () => {
  it('should raise an error', () => {
    const code = require('../../fixtures/miscellaneous/public-function-no-override')

    const report = linter.processStr(code, {
      rules: { 'comprehensive-interface': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('All public methods have to be an override'))
  })

  it('should not raise an error', () => {
    const code = require('../../fixtures/miscellaneous/public-function-with-override')

    const report = linter.processStr(code, {
      rules: { 'comprehensive-interface': 'error' }
    })

    assert.equal(report.errorCount, 0)
  })
})
