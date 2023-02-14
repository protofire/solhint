const assert = require('assert')
const linter = require('../../../lib/index')
const { contractWith, contractWithV7V8Header } = require('../../common/contract-builder')

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
})

describe('Linter - const-name-snakecase - V7 V8 additions', () => {
  it('should raise const name error', () => {
    const code = contractWithV7V8Header('uint private constant a;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('SNAKE_CASE'))
  })

  it('should not raise const name error for constants in snake case', () => {
    const code = contractWithV7V8Header('uint32 private constant THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not raise const name error for constants in snake case with single leading underscore', () => {
    const code = contractWithV7V8Header('uint32 private constant _THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not raise const name error for constants in snake case with double leading underscore', () => {
    const code = contractWithV7V8Header('uint32 private constant __THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise const name error for constants in snake case with more than two leading underscores', () => {
    const code = contractWithV7V8Header('uint32 private constant ___THE_CONSTANT = 10;')

    const report = linter.processStr(code, {
      rules: { 'const-name-snakecase': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('SNAKE_CASE'))
  })
})
