const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - const-name-snakecase', () => {
  it('should raise const name error', () => {
    const code = contractWith('uint private constant a;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('SNAKE_CASE'))
  })
})
