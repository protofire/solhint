const BaseChecker = require('./../base-checker');
const { tokens, hasSpace, nextTokenFromToken } = require('./../../common/tokens');


class SpaceAfterCommaChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitSourceUnit (ctx) {
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


class TokenList {

    static from(ctx) {
        return new TokenList(tokens(ctx));
    }

    constructor (tokens) {
        this.tokens = tokens;
    }

    commaTokens () {
        return this
            .tokens
            .filter(i => i.text === ',')
            .map(curToken => new CommaToken(this.tokens, curToken));
    }
}


class CommaToken {

    constructor (tokens, commaToken) {
        this.commaToken = commaToken;
        this.tokens = tokens;
    }

    isCorrectAligned() {
        const curToken = this.commaToken;
        const _nextToken = nextTokenFromToken(this.tokens, curToken);

        return hasSpace(_nextToken, curToken) || this._isCommaInEndOfExpression(_nextToken);
    }

    isIncorrectAligned() {
        return !this.isCorrectAligned();
    }

    _isCommaInEndOfExpression(token) {
        return [')', '}'].includes(token.text);
    }

    get line() {
        return this.commaToken.line;
    }

    get column() {
        return this.commaToken.column;
    }
}


module.exports = SpaceAfterCommaChecker;