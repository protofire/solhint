/* eslint-disable no-empty */
const assert = require('assert')

const linter = require('../../lib/index')
const { funcWith } = require('./contract-builder')

const {
  assertErrorCount,
  assertNoErrors,
  assertNoWarnings,
  assertErrorMessage,
} = require('./asserts')

const DIRECTIVE = 'solhint'

// Messages (match your rule implementations)
const msgNoConsole = `Unexpected console statement`
const msgReasonString = `Provide an error message`

describe('Configure the linter with comments (solhint-style directives)', () => {
  it('1) should support: // solhint-disable-next-line (disable ALL rules on next line)', () => {
    const code = funcWith(`
  // ${DIRECTIVE}-disable-next-line
  console.log("hi");
`)

    const report = linter.processStr(code, {
      rules: {
        'no-console': 'error',
      },
    })

    assertNoErrors(report)
    assertNoWarnings(report)
  })

  it('2) should support: // solhint-disable-next-line <ruleIds> (disable specific rules on next line)', () => {
    const code = funcWith(`
  // ${DIRECTIVE}-disable-next-line no-console
  console.log("hi");

  // no comment here => should still be reported
  require(a > b);
`)

    const report = linter.processStr(code, {
      rules: {
        'no-console': 'error',
        'reason-string': 'error',
      },
    })

    assertErrorCount(report, 1)
    assertErrorMessage(report, msgReasonString)
  })

  it('3) should support: // solhint-disable-line (disable ALL rules on current line)', () => {
    const code = funcWith(`
  console.log("hi"); // ${DIRECTIVE}-disable-line
`)

    const report = linter.processStr(code, {
      rules: {
        'no-console': 'error',
      },
    })

    assertNoErrors(report)
    assertNoWarnings(report)
  })

  it('4) should support: // solhint-disable-line <ruleIds> (disable specific rules on current line)', () => {
    const code = funcWith(`
    console.log("hi"); require(a > b); // ${DIRECTIVE}-disable-line no-console
`)

    const report = linter.processStr(code, {
      rules: {
        'no-console': 'error',
        'reason-string': 'error',
      },
    })

    // console suppressed, reason string reported
    assertErrorCount(report, 1)
    assertErrorMessage(report, msgReasonString)
    assert.ok(
      !report.messages
        .map((m) => m.message)
        .join('\n')
        .includes(msgNoConsole),
      'Did not expect no-console to be reported on disabled line'
    )
  })

  it('5) should support: /* solhint-disable <rule> */ ... /* solhint-enable <rule> */ (block disable one rule)', () => {
    const code = funcWith(`
  require(a > b); // should be reported

  /* ${DIRECTIVE}-disable no-console */
  console.log("hi"); // should be suppressed
  require(c > d); // should be reported again
  /* ${DIRECTIVE}-enable no-console */

  console.log("hi");        // should be reported again
`)

    const report = linter.processStr(code, {
      rules: {
        'no-console': 'error',
        'reason-string': 'error',
      },
    })

    // require first, require in the disabled block, console log after re-enable
    assertErrorCount(report, 3)
    assert.ok(report.reports[0].message.includes(msgReasonString))
    assert.ok(report.reports[1].message.includes(msgReasonString))
    assert.ok(report.reports[2].message.includes(msgNoConsole))
  })

  it('6) should support: /* solhint-disable */ ... /* solhint-enable */ (block disable ALL rules)', () => {
    const code = funcWith(`
  require(a > b); // should be reported

  /* ${DIRECTIVE}-disable */
  console.log("hi"); // should be suppressed
  require(c > d); // should be reported again
  /* ${DIRECTIVE}-enable */

  console.log("hi");        // should be reported again
`)

    const report = linter.processStr(code, {
      rules: {
        'no-console': 'error',
        'reason-string': 'error',
      },
    })

    // Only the println after re-enable
    assertErrorCount(report, 2)
    assert.ok(report.reports[0].message.includes(msgReasonString))
    assert.ok(report.reports[1].message.includes(msgNoConsole))
  })
})
