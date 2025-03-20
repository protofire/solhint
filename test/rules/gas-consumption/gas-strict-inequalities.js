const assert = require('assert')
const linter = require('../../../lib/index')
const { funcWith } = require('../../common/contract-builder')

const ERROR_MSG = 'GC: Non strict inequality found. Try converting to a strict one'

describe('Linter - gas-strict-inequalities', () => {
  it('should raise error on non strict equalities 1', () => {
    const code = funcWith(`
      uint256 a;
      uint256 b;
      uint256 c;
      uint256 d;
      
      if (a >= b) {  } 
      if (c <= d) {  } 
      if (c < d) {  } 
      if (c > d) {  }`)

    const report = linter.processStr(code, {
      rules: { 'gas-strict-inequalities': 'error' },
    })

    assert.equal(report.errorCount, 2)
    assert.equal(report.messages[0].message, ERROR_MSG)
    assert.equal(report.messages[1].message, ERROR_MSG)
  })

  it('should raise error on non strict equalities 2', () => {
    const code = funcWith(`
      uint256 a;
      uint256 b;
      uint256 c;
      uint256 d;
      
      while (a >= b) {

      }
              
      if (c < d) {  }`)

    const report = linter.processStr(code, {
      rules: { 'gas-strict-inequalities': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, ERROR_MSG)
    // assert.equal(report.errorCount, 0)
  })

  it('should raise error on non strict equalities 3', () => {
    const code = funcWith(`
      uint256 a;
      uint256 b;
      uint256 c;
      uint256 d;
      
      while (a >= b) {

      }
              
      if ((c < d) && (a <= b) && (d >= a)) {  }`)

    const report = linter.processStr(code, {
      rules: { 'gas-strict-inequalities': 'error' },
    })

    assert.equal(report.errorCount, 3)
    assert.equal(report.messages[0].message, ERROR_MSG)
    assert.equal(report.messages[1].message, ERROR_MSG)
    assert.equal(report.messages[2].message, ERROR_MSG)
    // assert.equal(report.errorCount, 0)
  })

  it('should NOT raise error on strict equalities', () => {
    const code = funcWith(`
      uint256 a;
      uint256 b;
      uint256 c;
      uint256 d;
      
      while (a > b) {

      }
              
      if ((c < d) && (a < b) && (d > a)) {  }`)

    const report = linter.processStr(code, {
      rules: { 'gas-strict-inequalities': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
