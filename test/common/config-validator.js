const assert = require('assert')
const sinon = require('sinon')
const _ = require('lodash')
const linter = require('../../lib/index')
const Reporter = require('../../lib/reporter')
const {
  validate,
  validSeverityMap,
  defaultSchemaValueForRules,
} = require('../../lib/config/config-validator')
const { assertErrorCount, assertErrorMessage } = require('./asserts')
const contractWith = require('./contract-builder').contractWith

const dummyCode = contractWith('function x() public {}')

describe('Config validator', () => {
  it('should check validSeverityMap', () => {
    assert.deepStrictEqual(validSeverityMap, ['error', 'warn'])
  })

  it('should check defaultSchemaValueForRules', () => {
    assert.deepStrictEqual(defaultSchemaValueForRules, {
      oneOf: [{ type: 'string', enum: ['error', 'warn', 'off'] }, { const: false }],
    })
  })

  it('should validate config', () => {
    const config = {
      extends: [],
      rules: {
        'avoid-throw': 'off',
        indent: ['error', 2],
      },
    }
    assert.deepStrictEqual(_.isUndefined(validate(config)), true)
  })

  it('should throw an error with wrong config', () => {
    const config = {
      test: [],
      rules: {
        'avoid-throw': 'off',
        indent: ['error', 2],
      },
    }
    assert.throws(() => validate(config), Error)
  })

  it('should work with an empty config', () => {
    const config = {}

    validate(config) // should not throw
  })
})

describe('Better errors addition + rule disable on error', () => {
  let warnSpy
  let reportErrorSpy
  let reportWarnSpy

  beforeEach(() => {
    // spy on console.warn
    warnSpy = sinon.spy(console, 'warn')

    // spy on reporter methods
    reportErrorSpy = sinon.spy(Reporter.prototype, 'error')
    reportWarnSpy = sinon.spy(Reporter.prototype, 'warn')
  })

  afterEach(() => {
    warnSpy.restore()
    reportErrorSpy.restore()
    reportWarnSpy.restore()
  })

  it('Valid CFG - execute: compiler-version config using default)', () => {
    const report = linter.processStr(
      `
      pragma solidity ^0.4.4;
      `,
      {
        rules: { 'compiler-version': 'error' },
      }
    )

    assertErrorCount(report, 1)
    assertErrorMessage(report, '^0.8.24')
  })

  it('Valid CFG - execute: quotes when only severity is provided using DEFAULT)', () => {
    const report = linter.processStr(
      `
      pragma solidity ^0.4.4;
      contract Test {
          string public name = 'Test';
      }
      `,
      {
        rules: { quotes: 'error' },
      }
    )

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Use double quotes for string literals')
  })

  it('Valid CFG - execute: reason-string when only severity is provided using DEFAULT)', () => {
    // using a string with 33 chars because default is 32
    const report = linter.processStr(
      `
      pragma solidity ^0.4.4;
      contract Test {
          string public name = 'Test';
          function test() public {
              revert("123456789012345678901234567890123");
          }
      }
      `,
      {
        rules: { 'reason-string': 'error' },
      }
    )
    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Error message for revert is too long: 33 counted / 32 allowed')
  })

  it('Valid CFG - execute: foundry-test-functions when only severity is provided using DEFAULT)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-test-functions': 'error' },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Function x() must match Foundry test naming convention')
  })

  it('Valid CFG - execute: foundry-test-functions when empty skip array is provided using DEFAULT)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-test-functions': ['error', []] },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'Function x() must match Foundry test naming convention')
  })

  it('Invalid CFG - not execute: compiler-version expects string)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'compiler-version': ['error', 123] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'compiler-version'"),
      `Expected a warning for compiler-version but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: max-line-length expects number)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'max-line-length': ['error', 'not-a-number'] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'max-line-length'"),
      `Expected a warning for max-line-length but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: interface-starts-with-i expects severity)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'interface-starts-with-i': 'warni' },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'interface-starts-with-i'"),
      `Expected a warning for interface-starts-with-i but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: interface-starts-with-i expects severity)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'interface-starts-with-i': '' },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'interface-starts-with-i'"),
      `Expected a warning for interface-starts-with-i but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - invalid rule name', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'interface-sta': 'warn' },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("[solhint] Warning: Rule 'interface-sta' doesn't exist"),
      `Expected a warning for interface-sta but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')

    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: interface-starts-with-i expects ONLY severity)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'interface-starts-with-i': ['warn', 7] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'interface-starts-with-i'"),
      `Expected a warning for interface-starts-with-i but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: interface-starts-with-i expects ONLY severity)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'interface-starts-with-i': { severity: 'warn' } },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'interface-starts-with-i'"),
      `Expected a warning for interface-starts-with-i but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: reason-string when incorrect object is provided)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'reason-string': ['warn', {}] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'reason-string'"),
      `Expected a warning for reason-string but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: immutable-vars-naming when user config is invalid)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'immutable-vars-naming': ['warn', { immutablesAsConstants: 10 }] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'immutable-vars-naming'"),
      `Expected a warning for immutable-vars-naming but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: immutable-vars-naming when no correct object is provided)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'immutable-vars-naming': ['warn', { 'invalid-key': true }] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'immutable-vars-naming'"),
      `Expected a warning for immutable-vars-naming but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: explicit-types when incorrect object is provided)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'explicit-types': ['warn', {}] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'explicit-types'"),
      `Expected a warning for explicit-types but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: quotes when wrong value is provided)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { quotes: ['warn', 'wrong-value'] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'quotes'"),
      `Expected a warning for quotes but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: foundry-test-functions when wrong value in array is provided)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-test-functions': ['error', [1]] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'foundry-test-functions'"),
      `Expected a warning for foundry-test-functions but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: foundry-test-functions when wrong type value is provided)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-test-functions': ['error', 'wrong'] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'foundry-test-functions'"),
      `Expected a warning for foundry-test-functions but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: foundry-test-functions when empty object is provided)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-test-functions': ['error', {}] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'foundry-test-functions'"),
      `Expected a warning for foundry-test-functions but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - use-natspec with wrong type for "enabled"', () => {
    const config = {
      title: {
        enabled: 'yes', // should be boolean
      },
    }

    const report = linter.processStr(dummyCode, {
      rules: { 'use-natspec': ['warn', config] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(logged.includes("invalid configuration for rule 'use-natspec'"), logged)
    assert.ok(warnSpy.called)
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - use-natspec with ignore as non-object', () => {
    const config = {
      title: {
        enabled: true,
        ignore: 'contractName', // should be an object
      },
    }

    const report = linter.processStr(dummyCode, {
      rules: { 'use-natspec': ['warn', config] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(logged.includes("invalid configuration for rule 'use-natspec'"), logged)
    assert.ok(warnSpy.called)
  })

  it('Invalid CFG - use-natspec with ignore.contract not as array', () => {
    const config = {
      title: {
        enabled: true,
        ignore: {
          contract: 'WrongFormat', // must be array
        },
      },
    }

    const report = linter.processStr(dummyCode, {
      rules: { 'use-natspec': ['warn', config] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(logged.includes("invalid configuration for rule 'use-natspec'"))
    assert.ok(warnSpy.called)
  })

  //
  // ---- foundry-no-block-time-number: CONFIG VALIDATOR TESTS ----
  //

  it('Valid CFG - accept: foundry-no-block-time-number with only severity (uses DEFAULT test dirs)', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-no-block-time-number': 'warn' },
    })

    // Not asserting execution here (rule is directory-gated and dummy file path may not match),
    // we only assert the config is accepted and no reporter was used.
    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    // No config warning should be printed
    sinon.assert.notCalled(warnSpy)
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Valid CFG - accept: foundry-no-block-time-number with custom test dirs array', () => {
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-no-block-time-number': ['warn', ['tests', 'e2e', 'it']] },
    })

    // Only checking config acceptance (no execution guarantees here).
    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    // No schema warning expected
    sinon.assert.notCalled(warnSpy)
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: foundry-no-block-time-number when wrong value type in array is provided', () => {
    // Second arg must be an array of strings; here it's [1] (invalid element type)
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-no-block-time-number': ['error', [1]] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'foundry-no-block-time-number'"),
      `Expected a warning for foundry-no-block-time-number but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: foundry-no-block-time-number when wrong option type is provided (string)', () => {
    // Second arg must be an array; here it's a string (invalid)
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-no-block-time-number': ['error', 'wrong'] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'foundry-no-block-time-number'"),
      `Expected a warning for foundry-no-block-time-number but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: foundry-no-block-time-number when empty object is provided', () => {
    // Second arg must be an array; here it's an object (invalid)
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-no-block-time-number': ['error', {}] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'foundry-no-block-time-number'"),
      `Expected a warning for foundry-no-block-time-number but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })

  it('Invalid CFG - not execute: foundry-no-block-time-number when array items are not strings (mixed types)', () => {
    // Mixed invalid item types
    const report = linter.processStr(dummyCode, {
      rules: { 'foundry-no-block-time-number': ['warn', ['tests', 123, null]] },
    })

    assert.equal(report.errorCount, 0)
    assert.equal(report.warningCount, 0)
    assert.deepEqual(report.messages, [])

    const logged = warnSpy
      .getCalls()
      .map((c) => c.args[0])
      .join('\n')

    assert.ok(
      logged.includes("invalid configuration for rule 'foundry-no-block-time-number'"),
      `Expected a warning for foundry-no-block-time-number but got:\n${logged}`
    )

    assert.ok(warnSpy.called, 'console.warn should have been called')
    sinon.assert.notCalled(reportErrorSpy)
    sinon.assert.notCalled(reportWarnSpy)
  })
})
