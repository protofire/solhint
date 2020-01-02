const assert = require('assert')
const { assertNoErrors, assertErrorCount, assertErrorMessage } = require('./../../common/asserts')
const linter = require('./../../../lib/index')

describe('Linter - compiler-version', () => {
  it('should disable only one compiler error on next line', () => {
    const report = linter.processStr(
      `
                // solhint-disable-next-line
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler error on previous line', () => {
    const report = linter.processStr(
      `
              pragma solidity 0.3.4;
              // solhint-disable-previous-line
              pragma solidity 0.3.4;
          `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler error on next line using multiline comment', () => {
    const report = linter.processStr(
      `
                /* solhint-disable-next-line */
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler error on previous line using multiline comment', () => {
    const report = linter.processStr(
      `
                pragma solidity ^0.4.4;
                /* solhint-disable-previous-line */
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
  })

  it('should disable only one compiler version error', () => {
    const report = linter.processStr(
      `
                /* solhint-disable compiler-version */
                pragma solidity 0.3.4;
                /* solhint-enable compiler-version */
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
    assertErrorMessage(report, '0.5.2')
  })

  it('should disable all errors', () => {
    const report = linter.processStr(
      `
                /* solhint-disable */
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )
    assertNoErrors(report)
  })

  it('should disable then enable all errors', () => {
    const report = linter.processStr(
      `
                /* solhint-disable */
                pragma solidity ^0.4.4;
                /* solhint-enable */
                pragma solidity ^0.4.4;
            `,
      {
        rules: { 'compiler-version': ['error', '^0.5.2'] }
      }
    )

    assertErrorCount(report, 1)
    assertErrorMessage(report, '0.5.2')
  })

  it('should return compiler version error', () => {
    const report = linter.processStr('pragma solidity 0.3.4;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('0.5.2'))
  })

  it('should not report compiler version error on exact match', () => {
    const report = linter.processStr('pragma solidity 0.5.2;', {
      rules: { 'compiler-version': ['error', '0.5.2'] }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not report compiler version error on range match', () => {
    const report = linter.processStr('pragma solidity ^0.5.2;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not report compiler version error on patch bump', () => {
    const report = linter.processStr('pragma solidity 0.5.3;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should not report compiler version error on range match', () => {
    const report = linter.processStr('pragma solidity ^0.5.3;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 0)
  })

  it('should report compiler version error on range not matching', () => {
    const report = linter.processStr('pragma solidity ^0.5.2;', {
      rules: { 'compiler-version': ['error', '^0.5.3'] }
    })

    assert.equal(report.errorCount, 1)
  })

  it('should report compiler version error on minor bump', () => {
    const report = linter.processStr('pragma solidity 0.6.0;', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 1)
  })

  it(`should report compiler version error if pragma doesn't exist`, () => {
    const report = linter.processStr('contract Foo {}', {
      rules: { 'compiler-version': ['error', '^0.5.2'] }
    })

    assert.equal(report.errorCount, 1)
  })

  it(`should not report compiler version error if pragma exist`, () => {
    const report = linter.processStr(
      `pragma solidity 0.6.0;
      contract Foo {}`,
      {
        rules: { 'compiler-version': ['error', '^0.6.0'] }
      }
    )

    assert.equal(report.errorCount, 0)
  })
})
