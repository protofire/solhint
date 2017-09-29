const BaseChecker = require('./../base-checker');
const { hasSpace, nextTokenFromToken, BaseTokenList, Token, AlignValidatable } = require('./../../common/tokens');


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


class TokenList extends BaseTokenList {

    commaTokens () {
        return this
            .tokens
            .filter(i => i.text === ',')
            .map(curToken => new CommaToken(this.tokens, curToken));
    }
}


class CommaToken extends AlignValidatable(Token) {

    constructor (tokens, commaToken) {
        super(tokens, commaToken);
    }

    isCorrectAligned() {
        const curToken = this.curToken;
        const _nextToken = nextTokenFromToken(this.tokens, curToken);

        return hasSpace(_nextToken, curToken) || this._isCommaInEndOfExpression(_nextToken);
    }

    _isCommaInEndOfExpression(token) {
        return [')', '}'].includes(token.text);
    }
}


module.exports = SpaceAfterCommaChecker;