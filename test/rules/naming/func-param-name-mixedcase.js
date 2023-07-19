const assert = require('assert')
const linter = require('../../../lib/index')
const contractWith = require('../../common/contract-builder').contractWith

describe('Linter - func-param-name-mixedcase', () => {
  describe('in functions', () => {
    it('should raise incorrect func param name error', () => {
      const code = contractWith('function funcName (uint A) public {}')

      const report = linter.processStr(code, {
        rules: { 'func-param-name-mixedcase': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('param'))
    })

    it('should not raise incorrect func param name error', () => {
      const code = contractWith('function funcName (uint someParam) public {}')

      const report = linter.processStr(code, {
        rules: { 'func-param-name-mixedcase': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })

    describe('with $ character', () => {
      const WITH_$ = {
        $: contractWith('function funcName (uint $) public {}'),
        'starting with $': contractWith('function funcName (uint $param) public {}'),
        'containing a $': contractWith('function funcName (uint pa$ram) public {}'),
        'ending with $': contractWith('function funcName (uint param$) public {}'),
      }

      for (const [key, code] of Object.entries(WITH_$)) {
        it(`should not raise func param name error for parameters ${key}`, () => {
          const report = linter.processStr(code, {
            rules: { 'func-param-name-mixedcase': 'error' },
          })

          assert.equal(report.errorCount, 0)
        })
      }
    })
  })

  describe('in events', () => {
    it('should raise var name error for event arguments illegal styling', () => {
      const code = contractWith('event Event1(uint B);')

      const report = linter.processStr(code, {
        rules: { 'func-param-name-mixedcase': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should not raise incorrect func param name error', () => {
      const code = contractWith('event Event1(uint someParam);')

      const report = linter.processStr(code, {
        rules: { 'func-param-name-mixedcase': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })

    describe('with $ character', () => {
      const WITH_$ = {
        $: contractWith('event Event1(uint $);'),
        'starting with $': contractWith('event Event1(uint $param);'),
        'containing a $': contractWith('event Event1(uint pa$ram);'),
        'ending with $': contractWith('event Event1(uint param$);'),
      }

      for (const [key, code] of Object.entries(WITH_$)) {
        it(`should not raise func name error for functions ${key}`, () => {
          const report = linter.processStr(code, {
            rules: { 'func-name-mixedcase': 'error' },
          })

          assert.equal(report.errorCount, 0)
        })
      }
    })
  })
})
