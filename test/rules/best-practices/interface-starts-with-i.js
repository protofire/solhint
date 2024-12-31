const assert = require('assert')
const { processStr } = require('../../../lib/index')

const config = {
  rules: { 'interface-starts-with-i': 'error' },
}

describe('Linter - interface-starts-with-i', () => {
  it('should raise error for interface not starting with I', () => {
    const code = 'interface Foo {}'
    const report = processStr(code, config)

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message === `Interface name 'Foo' must start with "I"`)
  })

  it('should not raise error for interface starting with I', () => {
    const code = 'interface IFoo {}'

    const report = processStr(code, config)
    assert.equal(report.errorCount, 0)
  })
})
