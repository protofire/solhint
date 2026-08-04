const { expect } = require('chai')
const sinon = require('sinon')

const { printPoster, printSuccessPoster } = require('../lib/cli/terminal-output')

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

    const output = consoleLog.args.flat().join('\n')
    expect(output).to.include('Continue your security review with Formal Verification')
    expect(output).not.to.include('500+ Formal Verification security checks')
    expect(output).to.include('https://bit.ly/dowsers')
    expect(output).to.include('Protofire')
    expect(output).not.to.include('https://protofire.io/')
    expect(output).to.include('https://calendly.com/vitaliy-chernov/30min')
    expect(output).not.to.include('Call')
  })

  it('prints the issues-found sentence when the report has errors or warnings', () => {
    printPoster()

    const output = consoleLog.args.flat().join('\n')
    expect(output).to.include('500+ Formal Verification security checks')
    expect(output).not.to.include('Continue your security review with Formal Verification')
  })

  it('uses short labels when terminal hyperlinks are supported', () => {
    printPoster(true, { FORCE_HYPERLINK: '1' }, { isTTY: true })

    const output = consoleLog.args.flat().join('\n')
    expect(output).to.include('Run a free scan')
    expect(output).to.include('https://dsa.dowsers.finance/scan/new?ref=solhint')
    expect(output).to.include('Protofire')
    expect(output).to.include('Call')
    expect(output).to.include('https://protofire.io/')
    expect(output).to.include('https://calendly.com/vitaliy-chernov/30min')
  })

  it('does not print the success poster in CI even when a TTY is allocated', () => {
    expect(printSuccessPoster({ isTTY: true }, { CI: 'true' })).to.equal(false)
    expect(consoleLog.called).to.equal(false)
  })
})
