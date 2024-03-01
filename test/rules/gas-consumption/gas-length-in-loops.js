const assert = require('assert')
const linter = require('../../../lib/index')
const funcWith = require('../../common/contract-builder').funcWith

const ERROR_MSG =
  'GC: Found [ .length ] property in Loop condition. Suggestion: assign it to a variable'

describe('Linter - gas-length-in-loops', () => {
  it('should raise error on ForLoop with .length in condition', () => {
    const code = funcWith(`
      for (uint256 length = 0; length > object.length; legnth++) {
        // code block to be executed
      }`)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should raise error on While with .length in condition', () => {
    const code = funcWith(`
      while (condition + 1 && boolIsTrue && arr.length > i) {
        // code block to be executed
        arr.length.push(1);
      }`)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should raise error on DoWhile with .length in condition', () => {
    const code = funcWith(`
        do {
          // code block to be executed
        } while (condition[5].member > 35 && length && arr.length < counter); 
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
  })

  it('should raise error on DoWhile and While with .length in condition', () => {
    const code = funcWith(`
        for (uint256 length = 0; condition; length++) {
          // code block to be executed
        }

        while (condition + 1 && boolIsTrue && arr.length > i) {
          // code block to be executed
          arr.length.push(1);
        }

        do {
          // code block to be executed
        } while (condition[5].member > 35 && length && arr.length < counter); 
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 2)
    assert.equal(report.messages[0].message, ERROR_MSG)
    assert.equal(report.messages[1].message, ERROR_MSG)
  })

  it('should NOT raise error on ForLoop with none .length in condition', () => {
    const code = funcWith(`
      for (initialization; condition; iteration) {
        // code block to be executed
      }`)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error on ForLoop with none .length in condition', () => {
    const code = funcWith(`
      for (uint256 length = 0; condition; length++) {
        // code block to be executed
      }`)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error on While with none .length in condition', () => {
    const code = funcWith(`
      while (condition) {
        // code block to be executed
      }`)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error on DoWhile with none .length in condition', () => {
    const code = funcWith(`
      do {
        // code block to be executed
      } while (condition[5].member > 35 && length);`)

    const report = linter.processStr(code, {
      rules: { 'gas-length-in-loops': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
