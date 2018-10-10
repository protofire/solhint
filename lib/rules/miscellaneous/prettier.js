const { showInvisibles, generateDifferences } = require('prettier-linter-helpers')
const { getLocFromIndex } = require('../../common/utils')
const BaseChecker = require('../base-checker')
const { RULES } = require('../../constants')

const { INSERT, DELETE, REPLACE } = generateDifferences

class Prettier extends BaseChecker {
  constructor(reporter, config, inputSrc, fileName) {
    super(reporter)
    this.inputSrc = inputSrc
    this.fileName = fileName
  }

  enterSourceUnit(ctx) {
    try {
      // Check for optional dependencies with the try catch
      // Prettier is expensive to load, so only load it if needed.
      const prettier = require('prettier')

      const formatted = prettier.format(this.inputSrc, {
        filepath: this.fileName,
        plugins: ['prettier-plugin-solidity']
      })

      const differences = generateDifferences(this.inputSrc, formatted)

      differences.forEach(difference => {
        let loc = null
        switch (difference.operation) {
          case INSERT:
            loc = getLocFromIndex(this.inputSrc, difference.offset)
            this.errorAt(
              loc.line,
              loc.column,
              RULES.PRETTIER,
              `Insert ${showInvisibles(difference.insertText)}`
            )
            break
          case DELETE:
            loc = getLocFromIndex(this.inputSrc, difference.offset)
            this.errorAt(
              loc.line,
              loc.column,
              RULES.PRETTIER,
              `Delete ${showInvisibles(difference.deleteText)}`
            )
            break
          case REPLACE:
            loc = getLocFromIndex(this.inputSrc, difference.offset)
            this.errorAt(
              loc.line,
              loc.column,
              RULES.PRETTIER,
              `Replace ${showInvisibles(difference.deleteText)} with ${showInvisibles(
                difference.insertText
              )}`
            )
            break
          default:
          // A switch must have a default
        }
      })
    } catch (e) {
      console.error(e)
      process.exit(1)
    }
  }
}

module.exports = Prettier
