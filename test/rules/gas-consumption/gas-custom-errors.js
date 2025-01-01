const assert = require('assert')
const {
  assertNoWarnings,
  assertNoErrors,
  assertErrorMessage,
  assertErrorCount,
  assertWarnsCount,
} = require('../../common/asserts')
const linter = require('../../../lib/index')
const { funcWith } = require('../../common/contract-builder')

function replaceSolidityVersion(code, newVersion) {
  // Regular expression to match the version number in the pragma directive
  const versionRegex = /pragma solidity \d+\.\d+\.\d+;/
  // Replace the matched version with the newVersion
  return code.replace(versionRegex, `pragma solidity ${newVersion};`)
}

describe('Linter - gas-custom-errors', () => {
  it('should raise error for require with a non-function-call second argument', () => {
    // second arg is a numeric literal instead of a function call
    const code = `
      pragma solidity 0.8.5;
      contract A {
        function test() external {
          require(msg.sender != address(0), 123);
        }
      }
    `
    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })
    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Use Custom Errors instead of require statements')
  })

  it('should raise error for require with no second argument', () => {
    const code = `
      pragma solidity 0.8.5;
      contract A {
        function test() external {
          require(msg.sender != address(0));
        }
      }
    `
    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })
    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Use Custom Errors instead of require statements')
  })

  it('should NOT raise error for require with comparison and custom error()', () => {
    let code = funcWith(`require(a > b, CustomErrorEmitted());`)
    code = replaceSolidityVersion(code, '^0.8.4')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should NOT raise error for require with function call and comparison along with custom error', () => {
    let code = funcWith(`require(isAok(a) > b, CustomErrorEmitted(param1));`)
    code = replaceSolidityVersion(code, '^0.8.4')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should NOT raise error for require with boolean check and custom error call', () => {
    let code = funcWith(`require(success, CustomErrorEmitted(param1, param2));`)
    code = replaceSolidityVersion(code, '^0.8.4')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should NOT raise error for require with function call and custom error call', () => {
    let code = funcWith(
      `require(isSuccess(param1) == true && value > 10, CustomErrorEmitted(param1, param2));`
    )
    code = replaceSolidityVersion(code, '^0.8.4')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should NOT raise error for require and mapping access with boolean value check and custom error call', () => {
    let code = funcWith(
      `require(users[msg.sender].isRegistered, CustomErrorEmitted(param1, param2));`
    )
    code = replaceSolidityVersion(code, '^0.8.4')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should raise error for revert()', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '^0.8.4')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'GC: Use Custom Errors instead of revert statement')
  })

  it('should raise error for revert([string])', () => {
    let code = funcWith(`revert("Insufficient funds");`)
    code = replaceSolidityVersion(code, '0.8.4')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'GC: Use Custom Errors instead of revert statement')
  })

  it('should NOT raise error for revert ErrorFunction()', () => {
    let code = funcWith(`revert ErrorFunction();`)
    code = replaceSolidityVersion(code, '^0.8.22')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should NOT raise error for revert ErrorFunction() with arguments', () => {
    let code = funcWith(`revert ErrorFunction({ msg: "Insufficient funds msg" });`)
    code = replaceSolidityVersion(code, '^0.8.5')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should raise error for require', () => {
    let code = funcWith(`require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;role.bearer[account] = true;
    `)
    code = replaceSolidityVersion(code, '0.8.21')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'GC: Use Custom Errors instead of require statement')
  })

  it('should NOT raise error for regular function call', () => {
    let code = funcWith(`callOtherFunction();
        role.bearer[account] = true;role.bearer[account] = true;
    `)
    code = replaceSolidityVersion(code, '^0.9.0')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })
    assertNoWarnings(report)
    assertNoErrors(report)
  })

  it('should raise error for require, revert message and not for revert CustomError() for [recommended] config', () => {
    let code = funcWith(`require(!has(role, account), "Roles: account already has role");
        revert("RevertMessage");
        revert CustomError();
    `)
    code = replaceSolidityVersion(code, '0.8.20')

    const report = linter.processStr(code, {
      extends: 'solhint:recommended',
      rules: { 'compiler-version': 'off' },
    })

    assertWarnsCount(report, 2)
    assert.equal(report.reports[0].message, 'GC: Use Custom Errors instead of require statements')
    assert.equal(report.reports[1].message, 'GC: Use Custom Errors instead of revert statements')
  })

  it('should NOT raise error for default config because rule is not part of default', () => {
    const code = funcWith(`require(!has(role, account), "Roles: account already has role");
        revert("RevertMessage");
        revert CustomError();
    `)
    const report = linter.processStr(code, {
      extends: 'solhint:default',
    })

    assertWarnsCount(report, 0)
    assertErrorCount(report, 0)
  })

  it('should NOT raise error for lower versions 0.8.3', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '0.8.3')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 0)
  })

  it('should NOT raise error for lower versions 0.4.4', () => {
    const code = funcWith(`revert("Insufficient funds");`)

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 0)
  })

  it('should raise error for higher versions 0.8', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '0.8')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 1)
    assert.equal(report.reports[0].message, 'GC: Use Custom Errors instead of revert statements')
  })

  it('should raise error for higher versions 0.9', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '0.9')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 1)
    assert.equal(report.reports[0].message, 'GC: Use Custom Errors instead of revert statements')
  })

  it('should NOT raise error for lower versions 0.7', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '0.7')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 0)
  })

  it('should NOT raise error for range versions lower than 0.8.4', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '>= 0.8.1 <= 0.8.3')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 0)
  })

  it('should raise error for range versions higher than 0.8.4', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '> 0.8.4 <= 0.9')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 1)
  })

  it('should raise error for range versions containing 0.8.4', () => {
    let code = funcWith(`revert();`)
    code = replaceSolidityVersion(code, '> 0.8.1 <= 0.8.6')

    const report = linter.processStr(code, {
      rules: { 'gas-custom-errors': 'error' },
    })

    assertErrorCount(report, 1)
  })
})
