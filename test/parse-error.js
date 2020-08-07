const assert = require('assert')
const { assertErrorCount } = require('./common/asserts')
const linter = require('./../lib/index')

describe('Parse error', () => {
  it('should report parse errors', () => {
    const report = linter.processStr('contract Foo {', {})

    assertErrorCount(report, 1)
    const error = report.reports[0]
    assert.equal(error.line, 1)
    assert.equal(error.column, 14)
    assert.ok(error.message.startsWith("Parse error: mismatched input '<EOF>'"))
  })
})
