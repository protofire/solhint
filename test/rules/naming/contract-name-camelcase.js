const assert = require('assert')
const linter = require('../../../lib/index')
const contractWith = require('../../common/contract-builder').contractWith

describe('Linter - contract-name-camelcase', () => {
  describe('in structs', () => {
    it('should raise contract name error', () => {
      const code = contractWith('struct a {}')

      const report = linter.processStr(code, {
        rules: { 'contract-name-camelcase': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('CamelCase'))
    })

    it('should not raise contract name error', () => {
      const code = contractWith('struct MyStruct {}')

      const report = linter.processStr(code, {
        rules: { 'contract-name-camelcase': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })

    describe('with $ character', () => {
      const WITH_$ = {
        $: contractWith('struct $ {}'),
        'starting with $': contractWith('struct $MyStruct {}'),
        'containing a $': contractWith('struct My$Struct {}'),
        'ending with $': contractWith('struct MyStruct$ {}'),
      }

      for (const [key, code] of Object.entries(WITH_$)) {
        it(`should not raise contract name error for structs ${key}`, () => {
          const report = linter.processStr(code, {
            rules: { 'contract-name-camelcase': 'error' },
          })

          assert.equal(report.errorCount, 0)
        })
      }
    })
  })

  describe('in contracts', () => {
    it('should raise contract name error', () => {
      const code = 'contract a {}'

      const report = linter.processStr(code, {
        rules: { 'contract-name-camelcase': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('CamelCase'))
    })

    it('should not raise contract name error', () => {
      const code = 'contract MyContract {}'

      const report = linter.processStr(code, {
        rules: { 'contract-name-camelcase': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })

    describe('with $ character', () => {
      const WITH_$ = {
        $: 'contract $ {}',
        'starting with $': 'contract $MyContract {}',
        'containing a $': 'contract My$Contract {}',
        'ending with $': 'contract MyContract$ {}',
      }

      for (const [key, code] of Object.entries(WITH_$)) {
        it(`should not raise contract name error for contracts ${key}`, () => {
          const report = linter.processStr(code, {
            rules: { 'contract-name-camelcase': 'error' },
          })

          assert.equal(report.errorCount, 0)
        })
      }
    })
  })

  describe('in enums', () => {
    it('should raise contract name error', () => {
      const code = contractWith('enum abc {}')

      const report = linter.processStr(code, {
        rules: { 'contract-name-camelcase': 'error' },
      })

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('CamelCase'))
    })

    it('should not raise contract name error', () => {
      const code = contractWith('enum MyEnum {}')

      const report = linter.processStr(code, {
        rules: { 'contract-name-camelcase': 'error' },
      })

      assert.equal(report.errorCount, 0)
    })

    describe('with $ character', () => {
      const WITH_$ = {
        $: contractWith('enum $ {}'),
        'starting with $': contractWith('enum $MyEnum {}'),
        'containing a $': contractWith('enum My$Enum {}'),
        'ending with $': contractWith('enum MyEnum$ {}'),
      }

      for (const [key, code] of Object.entries(WITH_$)) {
        it(`should not raise contract name error for structs ${key}`, () => {
          const report = linter.processStr(code, {
            rules: { 'contract-name-camelcase': 'error' },
          })

          assert.equal(report.errorCount, 0)
        })
      }
    })
  })
})
