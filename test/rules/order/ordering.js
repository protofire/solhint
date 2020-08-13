const assert = require('assert')
const linter = require('./../../../lib/index')
const contractWith = require('./../../common/contract-builder').contractWith
const correctExamples = require('../../fixtures/order/ordering-correct')
const incorrectExamples = require('../../fixtures/order/ordering-incorrect')

describe('Linter - ordering', () => {
  describe('correct examples', () => {
    correctExamples.forEach(({ code, description }) => {
      it(description, () => {
        const report = linter.processStr(code, {
          rules: { ordering: 'error' }
        })

        assert.equal(report.errorCount, 0)
      })
    })
  })

  describe('incorrect examples', () => {
    incorrectExamples.forEach(({ code, description }) => {
      it(description, () => {
        const report = linter.processStr(code, {
          rules: { ordering: 'error' }
        })

        assert.equal(report.errorCount, 1)
      })
    })
  })

  it('should raise incorrect function order error I', () => {
    const code = contractWith(`
                function b() private {}
                function () public payable {}
            `)

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Function order is incorrect'))
  })

  it('should raise incorrect function order error for external constant funcs', () => {
    const code = contractWith(`
                function b() external pure {}
                function c() external {}
            `)

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Function order is incorrect'))
  })

  it('should raise incorrect function order error for public constant funcs', () => {
    const code = contractWith(`
              function b() public pure {}
              function c() public {}
          `)

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Function order is incorrect'))
  })

  it('should raise incorrect function order error for internal function', () => {
    const code = contractWith(`
                function c() internal {}
                function b() external view {}
            `)

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Function order is incorrect'))
  })

  it('should not raise incorrect function order error', () => {
    const code = contractWith(`
                function A() public {}
                function () public payable {}
            `)

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not raise incorrect function order error I', () => {
    const code = require('../../fixtures/order/func-order-constructor-first')

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise incorrect function order error', () => {
    const code = require('../../fixtures/order/func-order-constructor-not-first')

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })
    assert.equal(report.errorCount, 1)
    assert.ok(report.messages[0].message.includes('Function order is incorrect'))
  })

  it('should not raise error when external const goes before public ', () => {
    const code = contractWith(`
                function a() external view {}
                function b() public {}
            `)

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should raise error for enum after contract', () => {
    const code = `
      contract Foo {}

      enum MyEnum { A, B }
    `

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 1)
  })

  it('should raise error for enum after function', () => {
    const code = contractWith(`
      function foo() public {}

      enum MyEnum { A, B }
    `)

    const report = linter.processStr(code, {
      rules: { ordering: 'error' }
    })

    assert.equal(report.errorCount, 1)
  })
})
