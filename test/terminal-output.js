const { expect } = require('chai')
const sinon = require('sinon')

const { printSuccessPoster } = require('../lib/cli/terminal-output')

describe('terminal output', () => {
  let consoleLog

  beforeEach(() => {
    consoleLog = sinon.stub(console, 'log')
  })

  afterEach(() => {
    consoleLog.restore()
  })

  it('does not print the success poster outside an interactive terminal', () => {
    expect(printSuccessPoster({ isTTY: false })).to.equal(false)
    expect(consoleLog.called).to.equal(false)
  })

  it('prints the success message and poster in an interactive terminal', () => {
    expect(printSuccessPoster({ isTTY: true }, {})).to.equal(true)
    expect(consoleLog.firstCall.args[0]).to.equal('Linting completed. No issues found!\n')
    expect(consoleLog.callCount).to.be.greaterThan(1)
  })

  it('does not print the success poster in CI even when a TTY is allocated', () => {
    expect(printSuccessPoster({ isTTY: true }, { CI: 'true' })).to.equal(false)
    expect(consoleLog.called).to.equal(false)
  })
})
