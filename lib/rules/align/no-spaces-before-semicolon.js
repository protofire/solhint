const BaseChecker = require('./../base-checker')
const {
  noSpaces,
  prevTokenFromToken,
  BaseTokenList,
  Token,
  AlignValidatable
} = require('./../../common/tokens')

class NoSpacesBeforeSemicolonChecker extends BaseChecker {
  constructor(reporter) {
    super(reporter, 'no-spaces-before-semicolon')
  }

  exitSourceUnit(ctx) {
    TokenList.from(ctx)
      .semicolonTokens()
      .filter(curToken => curToken.isIncorrectAligned())
      .forEach(this._error.bind(this))
  }

  _error(curToken) {
    const message = 'Semicolon must not have spaces before'
    this.errorAt(curToken.line, curToken.column, message)
  }
}

class TokenList extends BaseTokenList {
  semicolonTokens() {
    return this.tokens
      .filter(i => i.text === ';')
      .map(curToken => new SemicolonToken(this.tokens, curToken))
  }
}

class SemicolonToken extends AlignValidatable(Token) {
  isCorrectAligned() {
    const curToken = this.curToken
    const prevToken = prevTokenFromToken(this.tokens, curToken)

    return noSpaces(curToken, prevToken)
  }
}

module.exports = NoSpacesBeforeSemicolonChecker
