/**
 * @fileoverview Stylish Style formatter
 * @author Sindre Sorhus
 */

const picocolors = require('picocolors')
const { stripVTControlCharacters: stripAnsi } = require('util')
const table = require('text-table')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Given a word and a count, append an s if count is not one.
 * @param {string} word A word in its singular form.
 * @param {int} count A number controlling whether word should be pluralized.
 * @returns {string} The original word with an s on the end if count is not one.
 */
function pluralize(word, count) {
  return count === 1 ? word : `${word}s`
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

// eslint-disable-next-line func-names
module.exports = function (results) {
  let output = '\n'
  let errorCount = 0
  let warningCount = 0
  let fixableErrorCount = 0
  let fixableWarningCount = 0
  let summaryColor = 'yellow'

  results.forEach((result) => {
    const messages = result.messages

    if (messages.length === 0) {
      return
    }

    errorCount += result.errorCount
    warningCount += result.warningCount
    fixableErrorCount += result.fixableErrorCount
    fixableWarningCount += result.fixableWarningCount

    output += `${picocolors.underline(result.filePath)}\n`

    output += `${table(
      messages.map((message) => {
        let messageType

        if (message.fatal || message.severity === 2) {
          messageType = picocolors.red('error')
          summaryColor = 'red'
        } else {
          messageType = picocolors.yellow('warning')
        }

        return [
          '',
          message.line || 0,
          message.column || 0,
          messageType,
          message.message.replace(/([^ ])\.$/u, '$1'),
          picocolors.dim(message.ruleId || ''),
        ]
      }),
      {
        align: ['', 'r', 'l'],
        stringLength(str) {
          return stripAnsi(str).length
        },
      }
    )
      .split('\n')
      .map((el) => el.replace(/(\d+)\s+(\d+)/u, (m, p1, p2) => picocolors.dim(`${p1}:${p2}`)))
      .join('\n')}\n\n`
  })

  const total = errorCount + warningCount

  if (total > 0) {
    output += picocolors[summaryColor].bold(
      [
        '\u2716 ',
        total,
        pluralize(' problem', total),
        ' (',
        errorCount,
        pluralize(' error', errorCount),
        ', ',
        warningCount,
        pluralize(' warning', warningCount),
        ')\n',
      ].join('')
    )

    if (fixableErrorCount > 0 || fixableWarningCount > 0) {
      output += picocolors[summaryColor].bold(
        [
          '  ',
          fixableErrorCount,
          pluralize(' error', fixableErrorCount),
          ' and ',
          fixableWarningCount,
          pluralize(' warning', fixableWarningCount),
          ' potentially fixable with the `--fix` option.\n',
        ].join('')
      )
    }
  }

  // Resets output color, for prevent change on top level
  return total > 0 ? picocolors.reset(output) : ''
}
