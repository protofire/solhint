const _ = require('lodash');


class StatementsIndentValidator {
    constructor (ctx) {
        this.ctx = ctx;
    }

    cases(...cases) {
        this.casesList = cases;

        return this;
    }

    errorsTo(callback) {
        const validCase = this._validCase();
        validCase && validCase.validate(once(callback));
    }

    _validCase() {
        for (let curCase of this.casesList) {
            if (curCase.syntaxMatch(this.ctx)) {
                return curCase;
            }
        }

        return null;
    }
}


class SyntacticSequence {
    constructor() {
        this.items = [];
    }

    spaceAroundOrNot(...terms) {
        this.items.push(new SpaceAroundOrNot(...terms));

        return this;
    }

    spaceAround(...terms) {
        this.items.push(new SpaceAround(...terms));

        return this;
    }

    rule (name) {
        this.items.push(new Rule(name));

        return this;
    }

    term(...termNames) {
        this.items.push(new Term(...termNames));

        return this;
    }

    noSpaces() {
        const items = this.items;
        items.push(new NoSpaces(items[items.length - 1]));

        return this;
    }

    space () {
        const items = this.items;
        items.push(new Space(items[items.length - 1]));

        return this;
    }

    noSpacesAround(...names) {
        this.items.push(new NoSpacesAround(...names));

        return this;
    }

    expression() {
        return this.rule('expression');
    }

    statement() {
        return this.rule('statement');
    }

    errorsTo(ctx, callback) {
        if (this.syntaxMatch(ctx)) {
            this.validate(once(callback));
        }
    }

    syntaxMatch(ctx) {
        const childs = ctx.children;
        const syntaxMatchers = this.items.filter(i => i.syntaxMatch);

        if (!childs || childs.length === 0 || syntaxMatchers.length !== childs.length) {
            return false;
        }

        for (let i = 0; i < childs.length; i += 1) {
            if (!syntaxMatchers[i].syntaxMatch(childs[i])) {
                return false;
            }
        }

        return true;
    }

    validate(callback) {
        return this
            .items
            .filter(i => i.listenError)
            .forEach(i => i.listenError(callback));
    }
}


class Term {
    static term(...terms) {
        return new SyntacticSequence().term(...terms);
    }

    constructor(...terms) {
        this.terms = terms;
    }

    syntaxMatch(ctx) {
        if (this.terms.includes(ctx.getText())) {
            this.ctx = ctx;
            return true;
        } else {
            return false;
        }
    }
}


class Rule {
    static rule(name) {
        return new SyntacticSequence().rule(name);
    }

    static expression() {
        return Rule.rule('expression');
    }

    constructor(ruleName) {
        this.ruleName = ruleName;
    }

    _ruleToClassName() {
        return this.ruleName[0].toUpperCase() + this.ruleName.substr(1) + 'Context';
    }

    syntaxMatch(ctx) {
        if (ctx.constructor.name === this._ruleToClassName()) {
            this.ctx = ctx;

            return true;
        } else {
            return false;
        }
    }
}

class Space {
    constructor(prevRule) {
        this.prevRule = prevRule;
    }

    listenError (callback) {
        const ctx = this.prevRule.ctx;
        spaceAfter(ctx, callback);
    }
}

class NoSpaces {
    constructor(prevRule) {
        this.prevRule = prevRule;
    }

    listenError (callback) {
        noSpacesAfter(this.prevRule.ctx, callback);
    }
}


class NoSpacesAround extends Term {
    listenError (callback) {
        const ctx = this.ctx;

        noSpacesBefore(ctx, callback);
        noSpacesAfter(ctx, callback);
    }
}


class SpaceAroundOrNot extends Term {
    listenError (callback) {
        const ctx = this.ctx;
        const hasSpacesAround = hasSpaceBefore(ctx) && hasSpaceAfter(ctx);
        const hasNoSpacesAround = hasNoSpacesBefore(ctx) && hasNoSpaceAfter(ctx);

        if (!hasNoSpacesAround && !hasSpacesAround) {
            callback && callback(ctx, 'Use the same amount of whitespace on either side of an operator.');
        }
    }
}


class SpaceAround extends Term {
    listenError (callback) {
        const ctx = this.ctx;

        spaceAfter(ctx, callback);
        spaceBefore(ctx, callback);
    }
}


function tokens(ctx) {
    let curCtx = ctx;
    while (curCtx && curCtx.parentCtx && !curCtx.parser) {
        curCtx = curCtx.parentCtx;
    }

    return curCtx.parser._input.tokens;
}


function prevToken(ctx) {
    const token = ctx.start || ctx.symbol;
    const tokenList = tokens(ctx);
    const tokenIndex = _.sortedIndexBy(tokenList, token, token => token.start);

    let prevTokenIndex = tokenIndex - 1;
    while (prevTokenIndex >= 0 && tokenList[prevTokenIndex].channel !== 0) {
        prevTokenIndex -= 1;
    }

    return tokenList[prevTokenIndex];
}


function nextToken(ctx) {
    const token = ctx.stop || ctx.symbol;
    const tokenList = tokens(ctx);
    const tokenIndex = _.sortedIndexBy(tokenList, token, token => token.start);

    let nextTokenIndex = tokenIndex + 1;
    while (nextTokenIndex < tokenList.length && tokenList[nextTokenIndex].channel !== 0) {
        nextTokenIndex += 1;
    }

    return tokenList[nextTokenIndex];
}


function hasNoSpaceAfter(ctx) {
    const token = ctx.stop || ctx.symbol;
    const _nextToken = nextToken(ctx);

    return _nextToken.start - token.stop === 1 || !onSameLine(token, _nextToken);
}


function noSpacesAfter(ctx, callback) {
    if (!hasNoSpaceAfter(ctx)) {
        callback && callback(ctx, `Required no spaces after ${ctx.getText()}`);
    }
}


function hasNoSpacesBefore(ctx) {
    const token = ctx.start || ctx.symbol;
    const _prevToken = prevToken(ctx);

    return token.start - _prevToken.stop === 1 || !onSameLine(token, _prevToken);
}


function noSpacesBefore(ctx, callback) {
    if (!hasNoSpacesBefore(ctx)) {
        callback && callback(ctx, `Required no spaces before ${ctx.getText()}`);
    }
}


function hasSpaceBefore(ctx) {
    const token = ctx.start || ctx.symbol;
    const _prevToken = prevToken(ctx);

    return token.start - _prevToken.stop === 2 || !onSameLine(token, _prevToken);
}


function spaceBefore(ctx, callback) {
    if (!hasSpaceBefore(ctx)) {
        callback && callback(ctx, `Required space before ${ctx.getText()}.`);
    }
}


function hasSpaceAfter(ctx) {
    const token = ctx.stop || ctx.symbol;
    const _nextToken = nextToken(ctx);

    return _nextToken.start - token.stop === 2 || !onSameLine(token, _nextToken);
}


function spaceAfter(ctx, callback) {
    if (!hasSpaceAfter(ctx)) {
        callback && callback(ctx, `Required space after ${ctx.getText()}.`);
    }
}


function once(callback) {
    let callsCount = 0;

    return (...args) => callsCount++ === 0 && callback(...args);
}


function onSameLine(token1, token2) {
    return token1.line === token2.line;
}


module.exports = { StatementsIndentValidator, Rule, Term };
