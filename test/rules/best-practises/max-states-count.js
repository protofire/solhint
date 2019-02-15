const _ = require('lodash')
const { assertErrorCount, assertNoErrors, assertErrorMessage } = require('./../../common/asserts')
const linter = require('./../../../lib/index')
const { contractWith } = require('./../../common/contract-builder')

describe('Linter - max-states-count', () => {
  it('should raise error when count of states too big', () => {
    const code = contractWith(stateDef(16))

    const report = linter.processStr(code, {
      rules: { 'max-states-count': ['error', 15] }
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, 'no more than 15')
  })

  it('should not raise error for count of states that lower that max', () => {
    const code = contractWith([stateDef(10), constantDef(10)].join('\n'))

    const report = linter.processStr(code, {
      rules: { 'max-states-count': 'error' }
    })

    assertNoErrors(report)
  })

  it('should not raise error for count of states when it value increased in config', () => {
    const code = contractWith(stateDef(20))

    const report = linter.processStr(code, { rules: { 'max-states-count': ['error', 20] } })

    assertNoErrors(report)
  })

  function repeatLines(line, count) {
    return _.times(count)
      .map(() => line)
      .join('\n')
  }

  function stateDef(count) {
    return repeatLines('uint private a;', count)
  }

  function constantDef(count) {
    return repeatLines('uint private constant TEST = 1;', count)
  }
})
