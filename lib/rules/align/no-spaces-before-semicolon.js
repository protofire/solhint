const BaseChecker = require('./../base-checker');
const { noSpaces, prevTokenFromToken, BaseTokenList, Token } = require('./../../common/tokens');


class NoSpacesBeforeSemicolonChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitSourceUnit (ctx) {
        TokenList
            .from(ctx)
            .semicolonTokens()
            .filter(curToken => curToken.isIncorrectAligned())
            .forEach(this._error.bind(this));
    }

    _error(curToken) {
        const message = 'Semicolon must not have spaces before';
        this.reporter.errorAt(curToken.line, curToken.column, 'no-spaces-before-semicolon', message);
    }
}


class TokenList extends BaseTokenList {

    static from(ctx) {
        return new TokenList(ctx);
    }

    semicolonTokens () {
        return this
            .tokens
            .filter(i => i.text === ';')
            .map(curToken => new SemicolonToken(this.tokens, curToken));
    }
}


class SemicolonToken extends Token {

    constructor (tokens, curToken) {
        super(tokens, curToken);
    }

    isCorrectAligned() {
        const curToken = this.curToken;
        const prevToken = prevTokenFromToken(this.tokens, curToken);

        return noSpaces(curToken, prevToken);
    }

    isIncorrectAligned() {
        return !this.isCorrectAligned();
    }
}


module.exports = NoSpacesBeforeSemicolonChecker;