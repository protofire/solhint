const linter = require('./../../../lib/index')
const funcWith = require('./../../common/contract-builder').funcWith
const { assertWarnsCount, assertErrorMessage } = require('./../../common/asserts')

describe('Linter - avoid-low-level-calls', () => {
  const LOW_LEVEL_CALLS = [
    funcWith('msg.sender.call(code);'),
    funcWith('a.callcode(test1);'),
    funcWith('a.delegatecall(test1);')
  ]

  LOW_LEVEL_CALLS.forEach(curCode =>
    it('should return warn when code contains possible reentrancy', () => {
      const report = linter.processStr(curCode, {
        rules: { 'avoid-low-level-calls': 'warn' }
      })

      assertWarnsCount(report, 1)
      assertErrorMessage(report, 'low level')
    })
  )
})
