const { expect } = require('chai')
const sinon = require('sinon')

const {
  printPoster,
  printSuccessPoster,
  supportsTerminalHyperlinks,
} = require('../lib/cli/terminal-output')

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
    printPoster(
      true,
      { TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.14' },
      { isTTY: true },
    )

    const output = consoleLog.args.flat().join('\n')
    expect(output).to.include('Run a free scan')
    expect(output).to.include('https://dsa.dowsers.finance/scan/new?ref=solhint')
    expect(output).to.include('Protofire')
    expect(output).to.include('Call')
    expect(output).to.include('https://protofire.io/')
    expect(output).to.include('https://calendly.com/vitaliy-chernov/30min')
    expect(output).to.include('\u001B]8;;https://calendly.com/vitaliy-chernov/30min\u001B\\')
    expect(output).to.include('\u001B]8;;\u001B\\')
    expect(output).not.to.include('\u0007')
  })

  it('does not print the success poster in CI even when a TTY is allocated', () => {
    expect(printSuccessPoster({ isTTY: true }, { CI: 'true' })).to.equal(false)
    expect(consoleLog.called).to.equal(false)
  })

  describe('terminal hyperlink detection', () => {
    const tty = { isTTY: true }

    it('uses the URL fallback in the native macOS Terminal', () => {
      expect(supportsTerminalHyperlinks({ TERM_PROGRAM: 'Apple_Terminal' }, tty)).to.equal(false)

      printPoster(true, { TERM_PROGRAM: 'Apple_Terminal' }, tty)
      const output = consoleLog.args.flat().join('\n')
      expect(output).to.include('https://calendly.com/vitaliy-chernov/30min')
      expect(output).not.to.include('Call')
    })

    it('requires an iTerm2 version with OSC 8 support', () => {
      expect(
        supportsTerminalHyperlinks(
          { TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.0.15' },
          tty,
        ),
      ).to.equal(false)
      expect(
        supportsTerminalHyperlinks(
          { TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.1.0' },
          tty,
        ),
      ).to.equal(true)
    })

    it('treats a missing terminal version as supported', () => {
      expect(supportsTerminalHyperlinks({ TERM_PROGRAM: 'iTerm.app' }, tty)).to.equal(true)
      expect(supportsTerminalHyperlinks({ TERM_PROGRAM: 'vscode' }, tty)).to.equal(true)
      expect(
        supportsTerminalHyperlinks(
          { TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: 'unknown' },
          tty,
        ),
      ).to.equal(true)
    })

    it('requires a VS Code version with OSC 8 support', () => {
      expect(
        supportsTerminalHyperlinks({ TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.71.2' }, tty),
      ).to.equal(false)
      expect(
        supportsTerminalHyperlinks(
          { TERM_PROGRAM: 'vscode', TERM_PROGRAM_VERSION: '1.104.2' },
          tty,
        ),
      ).to.equal(true)
    })

    it('uses the URL fallback inside tmux and screen', () => {
      const iterm = { TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.14' }

      expect(supportsTerminalHyperlinks({ ...iterm, TERM: 'screen-256color' }, tty)).to.equal(false)
      expect(supportsTerminalHyperlinks({ ...iterm, TERM: 'tmux-256color' }, tty)).to.equal(false)
      expect(supportsTerminalHyperlinks({ ...iterm, TERM: 'xterm-256color' }, tty)).to.equal(true)
    })

    it('detects iTerm2 over ssh through LC_TERMINAL', () => {
      expect(supportsTerminalHyperlinks({ LC_TERMINAL: 'iTerm2', TERM: 'xterm' }, tty)).to.equal(
        true,
      )
    })

    it('falls back for unknown and non-interactive terminals', () => {
      expect(supportsTerminalHyperlinks({}, tty)).to.equal(false)
      expect(
        supportsTerminalHyperlinks(
          { TERM_PROGRAM: 'iTerm.app', TERM_PROGRAM_VERSION: '3.5.14' },
          { isTTY: false },
        ),
      ).to.equal(false)
    })

    it('allows an explicit override', () => {
      expect(
        supportsTerminalHyperlinks(
          { FORCE_HYPERLINK: '1', TERM_PROGRAM: 'Apple_Terminal' },
          { isTTY: false },
        ),
      ).to.equal(true)
      expect(supportsTerminalHyperlinks({ FORCE_HYPERLINK: '0' }, tty)).to.equal(false)
    })
  })
})
