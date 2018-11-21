const assert = require('assert')
const { assertErrorMessage, assertNoErrors, assertErrorCount } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { funcWith, contractWith } = require('./../../common/contract-builder')

describe('Linter - bracket-align', () => {
  it('should raise error when bracket incorrect aligned', () => {
    const code = funcWith(`
                for (uint i = 0; i < a; i += 1) 
                {
                  continue;
                }
            `)

    const report = linter.processStr(code, {
      rules: { 'bracket-align': 'error' }
    })

    assert.equal(report.errorCount, 1)
    assertErrorMessage(report, 0, 'Open bracket')
  })

  it('should not raise error when function bracket correct aligned', () => {
    const code = contractWith(`
                function a (
                    uint a
                ) 
                    public  
                {
                  continue;
                }
            `)

    const report = linter.processStr(code, { rules: { 'bracket-align': 'error' } })

    assertNoErrors(report)
  })

  it('should raise error when function bracket incorrect aligned', () => {
    const code = contractWith(`
                function a (uint a) public{
                  continue;
                }
            `)

    const report = linter.processStr(code, { rules: { 'bracket-align': 'error' } })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'bracket')
  })
})
