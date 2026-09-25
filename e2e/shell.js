// Solhint checks npm for a newer release before every run unless `--disc` is passed.
// That network call adds seconds to each invocation and makes this suite flaky against
// the mocha timeout, so every solhint command the e2e tests run gets `--disc` appended.
// Commands that already pass it, and anything that is not solhint, are left untouched.
const shelljs = require('shelljs')

function exec(command, ...args) {
  // `solhint` with no arguments prints usage and must stay untouched.
  const isSolhint = typeof command === 'string' && /^solhint\s+\S/.test(command)
  const alreadyDisabled = /(^|\s)--disc(\s|$)/.test(command)

  return shelljs.exec(isSolhint && !alreadyDisabled ? `${command} --disc` : command, ...args)
}

module.exports = { ...shelljs, exec }
