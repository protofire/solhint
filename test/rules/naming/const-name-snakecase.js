const assert = require('assert')
const linter = require('../../../lib/index')
const contractWith = require('../../common/contract-builder').contractWith

describe('Linter - const-name-snakecase', () => {
  it('should raise const name error', () => {
    const code = contractWith('uint private constant a;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('SNAKE_CASE'))
  })

  it('should not raise const name error for constants in snake case', () => {
    const code = contractWith('uint32 private constant THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not raise const name error for constants in snake case with single leading underscore', () => {
    const code = contractWith('uint32 private constant _THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not raise const name error for constants in snake case with double leading underscore', () => {
    const code = contractWith('uint32 private constant __THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise const name error for constants in snake case with more than two leading underscores', () => {
    const code = contractWith('uint32 private constant ___THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('SNAKE_CASE'))
  })

  describe('with $ character', () => {
    const WITH_$ = {
      $: contractWith('uint32 private constant $ = 10;'),
      'starting with $': contractWith('uint32 private constant $THE_CONSTANT = 10;'),
      'containing a $': contractWith('uint32 private constant THE_$_CONSTANT = 10;'),
      'ending with $': contractWith('uint32 private constant THE_CONSTANT$ = 10;'),
    }

    for (const [key, code] of Object.entries(WITH_$)) {
      it(`should not raise event name error for events ${key}`, () => {
        const report = linter.processStr(code, {
          rules: { 'const-name-snakecase': 'error' },
        })

        assert.equal(report.errorCount, 0)
      })
    }
  })
})
