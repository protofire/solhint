const { showInvisibles, generateDifferences } = require('prettier-linter-helpers')
const { getLocFromIndex } = require('../../common/utils')
const BaseChecker = require('../base-checker')

const { INSERT, DELETE, REPLACE } = generateDifferences

const ruleId = 'prettier/prettier'
const meta = {
  type: 'miscellaneous',

  docs: {
    description: 'Prettier rule for solidity projects.',
    category: 'Style Guide Rules'
  },

  isDefault: false,
  recommended: false,
  defaultSetup: 'warn',

  schema: []
}

class Prettier extends BaseChecker {
  constructor(reporter, config, inputSrc, fileName) {
    super(reporter, ruleId, meta)
    this.inputSrc = inputSrc
    this.fileName = fileName
  }

  enterSourceUnit() {
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
            this.errorAt(loc.line, loc.column, `Insert ${showInvisibles(difference.insertText)}`)
            break
          case DELETE:
            loc = getLocFromIndex(this.inputSrc, difference.offset)
            this.errorAt(loc.line, loc.column, `Delete ${showInvisibles(difference.deleteText)}`)
            break
          case REPLACE:
            loc = getLocFromIndex(this.inputSrc, difference.offset)
            this.errorAt(
              loc.line,
              loc.column,
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
