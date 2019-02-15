const assert = require('assert')
const { assertErrorMessage } = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - no-mix-tabs-and-spaces', () => {
  it('should raise error about mixed tabs and spaces', () => {
    const code = ' \t import "lib.sol";'

    const report = linter.processStr(code, { rules: { 'no-mix-tabs-and-spaces': 'error' } })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 0, 'Mixed tabs and spaces')
  })
})
