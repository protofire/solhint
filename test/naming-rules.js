const assert = require('assert')
const linter = require('./../lib/index')
const contractWith = require('./common/contract-builder').contractWith
const funcWith = require('./common/contract-builder').funcWith
const { noIndent } = require('./common/configs')

describe('Linter', () => {
  describe('NamingRules', () => {
    it('should raise incorrect func name error', () => {
      const code = contractWith('function AFuncName () public {}')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should dot raise incorrect func name error', () => {
      const code = contractWith('function aFunc1Nam23e () public {}')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 0)
    })

    it('should raise incorrect func param name error', () => {
      const code = contractWith('function funcName (uint A) public {}')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('param'))
    })

    it('should raise incorrect var name error', () => {
      const code = funcWith('var (a, B);')

      const report = linter.processStr(code, noIndent())

      assert.ok(report.errorCount > 0)
      assert.ok(report.messages.map(i => i.message).some(i => i.includes('name')))
    })

    it('should raise incorrect var name error for typed declaration', () => {
      const code = funcWith('uint B = 1;')

      const report = linter.processStr(code, noIndent())

      assert.ok(report.errorCount > 0)
      assert.ok(report.messages.map(i => i.message).some(i => i.includes('name')))
    })

    it('should raise incorrect var name error for state declaration', () => {
      const code = contractWith('uint32 private D = 10;')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('Variable name'))
    })

    it('should not raise var name error for constants in snake case', () => {
      const code = contractWith('uint32 private constant THE_CONSTANT = 10;')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 0)
    })

    it('should not raise var name error for constants in snake case with single leading underscore', () => {
      const code = contractWith('uint32 private constant _THE_CONSTANT = 10;')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 0)
    })

    it('should not raise var name error for constants in snake case with double leading underscore', () => {
      const code = contractWith('uint32 private constant __THE_CONSTANT = 10;')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 0)
    })

    it('should raise var name error for constants in snake case with more than two leading underscores', () => {
      const code = contractWith('uint32 private constant ___THE_CONSTANT = 10;')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('SNAKE_CASE'))
    })

    it('should raise var name error for event arguments illegal styling', () => {
      const code = contractWith('event Event1(uint B);')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should raise event name error for event in mixedCase', () => {
      const code = contractWith('event event1(uint a);')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('CamelCase'))
    })

    it('should raise const name error', () => {
      const code = contractWith('uint private constant a;')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('SNAKE_CASE'))
    })

    it('should raise modifier name error', () => {
      const code = contractWith('modifier owned_by(address a) { }')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('mixedCase'))
    })

    it('should not raise modifier name error', () => {
      const code = contractWith('modifier ownedBy(address a) { }')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 0)
    })

    it('should raise struct name error', () => {
      const code = contractWith('struct a {}')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('CamelCase'))
    })

    it('should raise contract name error', () => {
      const code = 'contract a {}'

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('CamelCase'))
    })

    it('should raise forbidden name error', () => {
      const code = funcWith('uint l = 0;')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('Avoid to use'))
    })

    it('should raise enum name error', () => {
      const code = contractWith('enum abc {}')

      const report = linter.processStr(code, noIndent())

      assert.equal(report.errorCount, 1)
      assert.ok(report.messages[0].message.includes('CamelCase'))
    })
  })
})
