const diff = require('fast-diff')
const prettier = require('prettier')
const BaseChecker = require('./base-checker')
const { showInvisibles } = require('prettier-linter-helpers')

const OPERATION_INSERT = 'insert'
const OPERATION_DELETE = 'delete'
const OPERATION_REPLACE = 'replace'
const LINE_ENDING_RE = /\r\n|[\r\n\u2028\u2029]/

function getLocFromIndex(text, index) {
  let line = 1
  let column = 0
  let i = 0
  while (i < index) {
    if (text[i] === '\n') {
      line++
      column = 0
    } else {
      column++
    }
    i++
  }

  return { line, column }
}

class Prettier extends BaseChecker {
  constructor(reporter, config) {
    super(reporter)
    this.config = config
  }

  enterSourceUnit(ctx) {
    try {
      const { originalText } = this.config

      const formatted = prettier.format(originalText, {
        filepath: 'Foo.sol',
        plugins: ['prettier-plugin-solidity']
      })

      const differences = generateDifferences(originalText, formatted)

      differences.forEach(difference => {
        let loc = null
        switch (difference.operation) {
          case OPERATION_INSERT:
            loc = getLocFromIndex(originalText, difference.offset)
            this.errorAt(loc.line, loc.column, 'prettier/prettier', `Insert ${showInvisibles(difference.insertText)}`)
            break
          case OPERATION_DELETE:
            loc = getLocFromIndex(originalText, difference.offset)
            this.errorAt(loc.line, loc.column, 'prettier/prettier', `Delete ${showInvisibles(difference.deleteText)}`)
            break
          case OPERATION_REPLACE:
            loc = getLocFromIndex(originalText, difference.offset)
            this.errorAt(loc.line, loc.column, 'prettier/prettier', `Replace ${showInvisibles(difference.deleteText)} with ${showInvisibles(difference.insertText)}`)
            break
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}

function generateDifferences(source, prettierSource) {
  // fast-diff returns the differences between two texts as a series of
  // INSERT, DELETE or EQUAL operations. The results occur only in these
  // sequences:
  //           /-> INSERT -> EQUAL
  //    EQUAL |           /-> EQUAL
  //           \-> DELETE |
  //                      \-> INSERT -> EQUAL
  // Instead of reporting issues at each INSERT or DELETE, certain sequences
  // are batched together and are reported as a friendlier "replace" operation:
  // - A DELETE immediately followed by an INSERT.
  // - Any number of INSERTs and DELETEs where the joining EQUAL of one's end
  // and another's beginning does not have line endings (i.e. issues that occur
  // on contiguous lines).

  const results = diff(source, prettierSource)
  const differences = []

  const batch = []
  let offset = 0 // NOTE: INSERT never advances the offset.
  while (results.length) {
    const result = results.shift()
    const op = result[0]
    const text = result[1]
    switch (op) {
      case diff.INSERT:
      case diff.DELETE:
        batch.push(result)
        break
      case diff.EQUAL:
        if (results.length) {
          if (batch.length) {
            if (LINE_ENDING_RE.test(text)) {
              flush()
              offset += text.length
            } else {
              batch.push(result)
            }
          } else {
            offset += text.length
          }
        }
        break
      default:
        throw new Error(`Unexpected fast-diff operation "${op}"`)
    }
    if (batch.length && !results.length) {
      flush()
    }
  }

  return differences

  function flush() {
    let aheadDeleteText = ''
    let aheadInsertText = ''
    while (batch.length) {
      const next = batch.shift()
      const op = next[0]
      const text = next[1]
      switch (op) {
        case diff.INSERT:
          aheadInsertText += text
          break
        case diff.DELETE:
          aheadDeleteText += text
          break
        case diff.EQUAL:
          aheadDeleteText += text
          aheadInsertText += text
          break
      }
    }
    if (aheadDeleteText && aheadInsertText) {
      differences.push({
        offset,
        operation: OPERATION_REPLACE,
        insertText: aheadInsertText,
        deleteText: aheadDeleteText
      })
    } else if (!aheadDeleteText && aheadInsertText) {
      differences.push({
        offset,
        operation: OPERATION_INSERT,
        insertText: aheadInsertText
      })
    } else if (aheadDeleteText && !aheadInsertText) {
      differences.push({
        offset,
        operation: OPERATION_DELETE,
        deleteText: aheadDeleteText
      })
    }
    offset += aheadDeleteText.length
  }
}

module.exports = Prettier
