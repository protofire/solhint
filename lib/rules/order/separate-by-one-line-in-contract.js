const BaseChecker = require('./../base-checker')
const BlankLineCounter = require('./../../common/blank-line-counter')
const { typeOf } = require('./../../common/tree-traversing')

class SeparateByOneLineInContractChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'separate-by-one-line-in-contract')
    this.lineCounter = new BlankLineCounter()
  }

  enterContractDefinition(ctx) {
    const lineCounter = this.lineCounter
    lineCounter.calcTokenLines(ctx)

    const items = ctx.children.filter(i => typeOf(i) === 'contractPart')

    for (let i = 0, j = i + 1; j < items.length; i += 1, j += 1) {
      const curItem = items[i]
      const nextItem = items[j]
      const bothPartsIsNotSingleLine = !(this.isSingleLine(curItem) && this.isSingleLine(nextItem))

      if (
        bothPartsIsNotSingleLine &&
        lineCounter.countOfEmptyLinesBetween(curItem, nextItem) !== 1
      ) {
        this._error(nextItem)
      }
    }
  }

  isSingleLine(item) {
    return item.start.line === item.stop.line
  }

  _error(ctx) {
    const message = 'Definitions inside contract / library must be separated by one line'
    this.error(ctx, message)
  }
}

module.exports = SeparateByOneLineInContractChecker
