const chalk = require('chalk')

function checkForUpdate() {
  return import('latest-version')
    .then((latestVersionModule) => {
      const latestVersion = latestVersionModule.default
      const currentVersion = require('../../package.json').version

      return latestVersion('solhint')
        .then((latest) => {
          if (currentVersion < latest) {
            console.log('A new version of Solhint is available:', latest)
            console.log('Please consider updating your Solhint package.')
          }
        })
        .catch((error) => {
          console.error('Error checking for updates:', error.message)
        })
    })
    .catch((error) => {
      console.error('Error importing latest-version:', error.message)
    })
}

const posterWidth = 104
const posterOpeningArrowColumn = 1
const posterClosingArrowColumn = 97
const posterBox = {
  topLeft: '\u250c',
  topRight: '\u2510',
  bottomLeft: '\u2514',
  bottomRight: '\u2518',
  horizontal: '\u2500',
  vertical: '\u2502',
}

function supportsTerminalHyperlinks(env = process.env, stream = process.stdout) {
  if (env.FORCE_HYPERLINK === '1') return true
  if (env.FORCE_HYPERLINK === '0') return false
  if (!stream.isTTY) return false
  if (env.TERM === 'dumb') return false
  if (env.TERM_PROGRAM === 'Apple_Terminal') return false
  if (env.TERM_PROGRAM === 'iTerm.app') return true
  if (['Hyper', 'WezTerm', 'WarpTerminal', 'vscode'].includes(env.TERM_PROGRAM)) return true
  if (['xterm-kitty', 'xterm-ghostty'].includes(env.TERM)) return true
  if (env.WT_SESSION || env.TERMINOLOGY) return true

  const vteVersion = Number(env.VTE_VERSION || 0)
  return vteVersion >= 5000
}

function clickableLink(url, text) {
  return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`
}

function posterSegment(text, style, url, linksSupported = true) {
  const styledText = style(text)

  return {
    printable: url && linksSupported ? clickableLink(url, styledText) : styledText,
    visibleLength: text.length,
  }
}

function posterSpacer(length, style) {
  return posterSegment(' '.repeat(Math.max(length, 0)), style)
}

function posterSegmentsLength(segments) {
  return segments.reduce((sum, segment) => sum + segment.visibleLength, 0)
}

function posterArrowLine(bodySegments, arrowStyle) {
  const bodyLength = posterSegmentsLength(bodySegments)
  const openingArrowLength = '===>'.length
  const closingArrowLength = '<==='.length
  const bodyStartColumn = posterOpeningArrowColumn + openingArrowLength
  const bodyWidth = posterClosingArrowColumn - bodyStartColumn
  const bodyLeftPadding = Math.floor((bodyWidth - bodyLength) / 2)
  const bodyRightPadding = bodyWidth - bodyLength - bodyLeftPadding
  const rightPadding = posterWidth - 2 - posterClosingArrowColumn - closingArrowLength

  return [
    posterSpacer(posterOpeningArrowColumn, arrowStyle),
    posterSegment('===>', arrowStyle),
    posterSpacer(bodyLeftPadding, arrowStyle),
    ...bodySegments,
    posterSpacer(bodyRightPadding, arrowStyle),
    posterSegment('<===', arrowStyle),
    posterSpacer(rightPadding, arrowStyle),
  ]
}

function posterLine(segments, borderStyle) {
  const content = segments.map((segment) => segment.printable).join('')
  const visibleLength = posterSegmentsLength(segments)
  const padding = ' '.repeat(Math.max(posterWidth - visibleLength - 2, 0))

  return borderStyle(posterBox.vertical) + content + padding + borderStyle(posterBox.vertical)
}

function posterBorder(left, right, borderStyle) {
  return borderStyle(left + posterBox.horizontal.repeat(posterWidth - 2) + right)
}

function printPosterBox(segments, borderStyle, trailingBlankLine = false) {
  console.log(posterBorder(posterBox.topLeft, posterBox.topRight, borderStyle))
  console.log(posterLine(segments, borderStyle))
  console.log(posterBorder(posterBox.bottomLeft, posterBox.bottomRight, borderStyle))

  if (trailingBlankLine) {
    console.log('')
  }
}

function posterAudit(linksSupported) {
  const borderStyle = chalk.yellow.bold
  const textStyle = chalk.yellow
  const protofireUrl = 'https://protofire.io/'
  const callUrl = 'https://calendly.com/vitaliy-chernov/30min'

  printPosterBox(
    posterArrowLine(
      [
        posterSegment('Smart contract Audits by ', chalk.white.bold),
        posterSegment('Protofire', chalk.bgYellow.black.bold, protofireUrl, linksSupported),
        posterSegment('  |  Book a ', chalk.white.bold),
        posterSegment(
          linksSupported ? 'Call' : callUrl,
          chalk.bgYellow.black.bold,
          callUrl,
          linksSupported,
        ),
      ],
      textStyle,
    ),
    borderStyle,
    true,
  )
}

function posterExternal(linksSupported, issuesFound) {
  const fallbackUrl = 'https://bit.ly/dowsers'
  const linkUrl = 'https://dsa.dowsers.finance/scan/new?ref=solhint'
  const bodySegments = [
    posterSegment(' NEW ', chalk.bgRed.white.bold),
    posterSegment(
      issuesFound
        ? ' 500+ Formal Verification security checks'
        : ' Continue your security review with Formal Verification ',
      chalk.white.bold,
    ),
    posterSegment(' \u2192 ', chalk.cyan),
    posterSegment(
      linksSupported ? 'Run a free scan' : `${issuesFound ? 'Free scan: ' : ''}${fallbackUrl}`,
      linksSupported ? chalk.bgCyan.black.bold : chalk.cyan,
      linksSupported ? linkUrl : fallbackUrl,
      linksSupported,
    ),
  ]

  printPosterBox(posterArrowLine(bodySegments, chalk.cyan), chalk.cyan.bold, false)
}

function printPoster(issuesFound = true, env = process.env, stream = process.stdout) {
  const linksSupported = supportsTerminalHyperlinks(env, stream)

  posterExternal(linksSupported, issuesFound)
  posterAudit(linksSupported)
}

function printSuccessPoster(stream = process.stdout, env = process.env) {
  const isCi = env.CI && env.CI !== 'false' && env.CI !== '0'
  if (!stream.isTTY || isCi) return false

  console.log('Linting completed. No issues found!\n')
  printPoster(false, env, stream)
  return true
}

module.exports = {
  checkForUpdate,
  printPoster,
  printSuccessPoster,
  supportsTerminalHyperlinks,
}
