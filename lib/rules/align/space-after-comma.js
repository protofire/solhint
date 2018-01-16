const BaseChecker = require('./../base-checker');
const { hasSpace, nextTokenFromToken, BaseTokenList, Token, AlignValidatable } = require('./../../common/tokens');
const { noSpaces, prevTokenFromToken } = require('./../../common/tokens');


class SpaceAfterCommaChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitSourceUnit(ctx) {
        TokenList
            .from(ctx)
            .commaTokens()
            .filter(curToken => curToken.isIncorrectAligned())
            .forEach(this._error.bind(this));
    }

    _error(curToken) {
        const message = 'Comma must be separated from next element by space';
        this.reporter.errorAt(curToken.line, curToken.column, 'space-after-comma', message);
    }
}


class TokenList extends BaseTokenList {

    commaTokens() {
        return this
            .tokens
            .filter(i => i.text === ',')
            .map(curToken => new CommaToken(this.tokens, curToken));
    }
}


class CommaToken extends AlignValidatable(Token) {

    constructor(tokens, commaToken) {
        super(tokens, commaToken);
    }

    isCorrectAligned() {
        return (this._isNoSpacesBefore() || this._isCommaAfterComma())
            && (this._isSpaceAfter() || this._isCommaInEndOfExpression());
    }

    _isNoSpacesBefore() {
        return noSpaces(this.curToken, this._prevToken());
    }

    _isSpaceAfter() {
        return hasSpace(this._nextToken(), this.curToken);
    }

    _isCommaInEndOfExpression() {
        const curToken = this.curToken;
        const _nextToken = nextTokenFromToken(this.tokens, curToken);

        return [')', '}'].includes(_nextToken.text);
    }

    _isCommaAfterComma() {
        const curToken = this.curToken;
        const _prevToken = prevTokenFromToken(this.tokens, curToken);

        return [','].includes(_prevToken.text);
    }

    _prevToken() {
        return prevTokenFromToken(this.tokens, this.curToken);
    }

    _nextToken() {
        return nextTokenFromToken(this.tokens, this.curToken);
    }
}


module.exports = SpaceAfterCommaChecker;
