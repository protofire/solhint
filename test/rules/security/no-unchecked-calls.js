const assert = require('assert')
const linter = require('../../../lib/index')
const funcWith = require('../../common/contract-builder').funcWith
const { assertWarnsCount, assertNoWarnings, assertErrorMessage } = require('../../common/asserts')

describe('Linter - no-unchecked-calls', () => {
  it('should warn when call() return value is not checked', () => {
    const code = funcWith('addr.call(data);')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'not checked')
  })

  it('should warn when staticcall() return value is not checked', () => {
    const code = funcWith('addr.staticcall(data);')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'not checked')
  })

  it('should warn when delegatecall() return value is not checked', () => {
    const code = funcWith('addr.delegatecall(data);')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertWarnsCount(report, 1)
    assertErrorMessage(report, 'not checked')
  })

  it('should warn when call{value} return value is not checked', () => {
    const code = funcWith('addr.call{value: 1 ether}("");')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertWarnsCount(report, 1)
  })

  it('should not warn when return value is captured in tuple assignment', () => {
    const code = funcWith('(bool success, ) = addr.call(data);')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when return value is captured with bytes in tuple', () => {
    const code = funcWith('(bool success, bytes memory result) = addr.call(data);')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when call is used inside an if statement', () => {
    const code = funcWith('if(addr.call(data)) {}')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when call is wrapped in require', () => {
    const code = funcWith('require(addr.call(data));')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when call is wrapped in assert', () => {
    const code = funcWith('assert(addr.call(data));')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when staticcall is wrapped in require', () => {
    const code = funcWith('require(addr.staticcall(data));')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should not warn when delegatecall return value is captured', () => {
    const code = funcWith('(bool ok, ) = addr.delegatecall(data);')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertNoWarnings(report)
  })

  it('should warn for legacy addr.call.value(1)() when return value is not checked', () => {
    const code = funcWith('addr.call.value(1)();')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'warn' },
    })

    assertWarnsCount(report, 1)
  })

  it('should report as error when configured with error severity', () => {
    const code = funcWith('addr.call(data);')

    const report = linter.processStr(code, {
      rules: { 'no-unchecked-calls': 'error' },
    })

    assert.equal(report.errorCount, 1)
    assert.ok(report.reports[0].message.includes('not checked'))
  })
})
