const assert = require('assert')
const linter = require('../../../lib/index')
const contractWith = require('../../common/contract-builder').contractWith

describe('Linter - custom-error-name-camelcase', () => {
  it('should raise custom error name camelcase', () => {
    const code = contractWith('error Err_Abc();')

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'error', 'custom-error-name-camelcase': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].ruleId.includes('custom-error-name-camelcase'))
    assert.ok(report.messages[0].message.includes('CamelCase'))
  })

  it('should not raise custom error name camelcase', () => {
    const code = contractWith('error Abc();')

    const report = linter.processStr(code, {
      rules: { 'no-unused-vars': 'error', 'custom-error-name-camelcase': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise custom error name camelcase', () => {
    const code = contractWith('error Err__Abc();')

    const report = linter.processStr(code, {
      rules: {
        'no-unused-vars': 'error',
        'custom-error-name-camelcase': ['error', { alllowPrefix: false }],
      },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].ruleId.includes('custom-error-name-camelcase'))
    assert.ok(report.messages[0].message.includes('CamelCase'))
  })

  it('should raise custom error name camelcase', () => {
    const code = contractWith('error Err__Abc__Def();')

    const report = linter.processStr(code, {
      rules: {
        'no-unused-vars': 'error',
        'custom-error-name-camelcase': ['error', { alllowPrefix: true }],
      },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].ruleId.includes('custom-error-name-camelcase'))
    assert.ok(report.messages[0].message.includes('CamelCase'))
  })

  it('should not raise custom error name camelcase', () => {
    const code = contractWith('error Err__Abc();')

    const report = linter.processStr(code, {
      rules: {
        'no-unused-vars': 'error',
        'custom-error-name-camelcase': ['error', { allowPrefix: true }],
      },
    })

    assert.equal(report.errorCount, 0)
  })
})
