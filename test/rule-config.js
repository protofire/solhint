const assert = require('assert')
const linter = require('./../lib/index')

describe('Linter', () => {
  describe('Config', () => {
    it('should disable fixed compiler error', () => {
      const config = {
        rules: {
          'compiler-fixed': false
        }
      }

      const report = linter.processStr('pragma solidity ^0.4.4;', config)

      assert.equal(report.errorCount, 0)
    })

    it('should change error to warn for fixed compiler issue', () => {
      const config = {
        rules: {
          'compiler-fixed': 'warn'
        }
      }

      const report = linter.processStr('pragma solidity ^0.4.4;', config)

      assert.equal(report.errorCount, 0)
      assert.equal(report.warningCount, 1)
      assert.ok(report.messages[0].message.includes('Compiler'))
    })

    it('should change error to warn for fixed compiler issue for array config', () => {
      const config = {
        rules: {
          'compiler-fixed': ['warn']
        }
      }

      const report = linter.processStr('pragma solidity ^0.4.4;', config)

      assert.equal(report.errorCount, 0)
      assert.equal(report.warningCount, 1)
      assert.ok(report.messages[0].message.includes('Compiler'))
    })
  })
})
