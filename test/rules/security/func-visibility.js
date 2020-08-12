const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith

describe('Linter - func-visibility', () => {
  it('should return required visibility error', () => {
    require('../../fixtures/security/functions-without-visibility').forEach(func => {
      const code = contractWith(func)

      const report = linter.processStr(code, {
        rules: { 'func-visibility': 'warn' }
      })

      assert.equal(report.warningCount, 1)
      assert.ok(report.reports[0].message.includes('visibility'))
    })
  })

  it('should not return required visibility error', () => {
    require('../../fixtures/security/functions-with-visibility').forEach(func => {
      const code = contractWith(func)

      const report = linter.processStr(code, {
        rules: { 'func-visibility': 'warn' }
      })

      assert.equal(report.warningCount, 0)
    })
  })

  describe("when 'ignoreConstructors' is enabled", () => {
    it('should ignore constructors without visibility', () => {
      const code = contractWith('constructor () {}')

      const report = linter.processStr(code, {
        rules: {
          'func-visibility': ['warn', { ignoreConstructors: true }]
        }
      })

      assert.equal(report.warningCount, 0)
    })

    it('should still report functions without visibility', () => {
      const code = contractWith('function foo() {}')

      const report = linter.processStr(code, {
        rules: {
          'func-visibility': ['warn', { ignoreConstructors: true }]
        }
      })

      assert.equal(report.warningCount, 1)
    })
  })
})
