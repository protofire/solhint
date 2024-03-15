const assert = require('assert')
const linter = require('../../../lib/index')
const { contractWith } = require('../../common/contract-builder')

const replaceErrorMsg = (parameterName, functionName) => {
  const errMsg = `GC: [${parameterName}] argument on Function [${functionName}] could be [calldata] if it's not being updated`
  return errMsg
}

describe('Linter - gas-calldata-parameters', () => {
  it('should raise error on strVar', () => {
    const code = contractWith(`
      function function1(
          uint256[] memory arrayUint,
          bool active,
          string memory strVar
      ) external pure {
          active = true;
          arrayUint[0] = 1;          
      }      
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-calldata-parameters': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, replaceErrorMsg('strVar', 'function1'))
  })

  it('should raise error on strVar and arrayUint', () => {
    const code = contractWith(`
      function function1(
          uint256[] memory arrayUint,
          bool active,
          string memory strVar
      ) external pure {
          active = true;          
      }      
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-calldata-parameters': 'error' },
    })

    assert.equal(report.errorCount, 2)
    assert.equal(report.messages[0].message, replaceErrorMsg('arrayUint', 'function1'))
    assert.equal(report.messages[1].message, replaceErrorMsg('strVar', 'function1'))
  })

  it('should raise error on arrayUint', () => {
    const code = contractWith(`
      function function1(
          uint256[] memory arrayUint,
          bool active,
          CustomStruct memory customStruct
      ) external pure {
        customStruct.field1 = true;          
      }      
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-calldata-parameters': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, replaceErrorMsg('arrayUint', 'function1'))
  })

  it('should raise error on arrayUint, customStruct and strVar', () => {
    const code = contractWith(`
      function functionTest1(
          uint256[] memory arrayUint,
          bool active,
          CustomStruct memory customStruct,
          string memory strVar
      ) external pure {
        active = true;          
        string strVar2 = strVar;
        active = customStruct.active;
      }      
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-calldata-parameters': 'error' },
    })

    assert.equal(report.errorCount, 3)
    assert.equal(report.messages[0].message, replaceErrorMsg('arrayUint', 'functionTest1'))
    assert.equal(report.messages[1].message, replaceErrorMsg('customStruct', 'functionTest1'))
    assert.equal(report.messages[2].message, replaceErrorMsg('strVar', 'functionTest1'))
  })

  it('should raise error on customStruct and strVar', () => {
    const code = contractWith(`
      function functionTest1(
          uint256[] memory arrayUint,
          bool active,
          CustomStruct memory customStruct,
          string memory strVar
      ) external pure {
        arrayUint[i]++;
      }      
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-calldata-parameters': 'error' },
    })

    assert.equal(report.errorCount, 2)
    assert.equal(report.messages[0].message, replaceErrorMsg('customStruct', 'functionTest1'))
    assert.equal(report.messages[1].message, replaceErrorMsg('strVar', 'functionTest1'))
  })

  it('should raise error on arrayUint', () => {
    const code = contractWith(`
      function functionTest1(
          uint256[] memory arrayUint,
          bool active,
          CustomStruct memory customStruct,
          string memory strVar
      ) external pure {
        customStruct.field1 = "something";
        strVar <<= active;
      }      
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-calldata-parameters': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.equal(report.messages[0].message, replaceErrorMsg('arrayUint', 'functionTest1'))
  })

  it('should NOT raise error', () => {
    const code = contractWith(`
      function function1(
          uint256[] memory arrayUint,
          bool active,
          string memory strVar
      ) external pure {
          active = true;          
          arrayUint[0] = 1;
          strVar = '';
      }      
      `)

    const report = linter.processStr(code, {
      rules: { 'gas-calldata-parameters': 'error' },
    })

    assert.equal(report.errorCount, 0)
  })
})
