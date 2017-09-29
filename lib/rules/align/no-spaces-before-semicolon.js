const BaseChecker = require('./../base-checker');
const { tokens, noSpaces, prevTokenFromToken } = require('./../../common/tokens');


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


class TokenList {

    static from(ctx) {
        return new TokenList(tokens(ctx));
    }

    constructor (tokens) {
        this.tokens = tokens;
    }

    semicolonTokens () {
        return this
            .tokens
            .filter(i => i.text === ';')
            .map(curToken => new SemicolonToken(this.tokens, curToken));
    }
}


class SemicolonToken {

    constructor (tokens, commaToken) {
        this.commaToken = commaToken;
        this.tokens = tokens;
    }

    isCorrectAligned() {
        const curToken = this.commaToken;
        const prevToken = prevTokenFromToken(this.tokens, curToken);

        return noSpaces(curToken, prevToken);
    }

    isIncorrectAligned() {
        return !this.isCorrectAligned();
    }

    get line() {
        return this.commaToken.line;
    }

    get column() {
        return this.commaToken.column;
    }
}


module.exports = NoSpacesBeforeSemicolonChecker;