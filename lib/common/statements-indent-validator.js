

class StatementsIndentValidator {
    constructor (ctx) {
        this.ctx = ctx;
    }

    cases(...cases) {
        this.casesList = cases;

        return this;
    }

    forEachError(callback) {
        this.casesList.forEach(curCase =>
            curCase.forEachError(this.ctx, callback)
        );
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

    forEachError(ctx, callback) {
        if (this._syntaxMatch(ctx)) {
            this._validate(once(callback));
        }
    }

    _syntaxMatch(ctx) {
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

    _validate(callback) {
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
        const token = ctx.start || ctx.symbol;
        const _nextToken = nextToken(ctx);

        if (!(_nextToken.start - token.stop === 2)) {
            callback && callback(ctx, `Required space after ${ctx.getText()}.`);
        }
    }
}

class NoSpaces {
    constructor(prevRule) {
        this.prevRule = prevRule;
    }

    listenError (callback) {
        const ctx = this.prevRule.ctx;
        const token = ctx.start || ctx.symbol;
        const _nextToken = nextToken(ctx);

        if (!(_nextToken.start - token.stop === 1)) {
            callback && callback(ctx, `Required no spaces after ${ctx.getText()}`);
        }
    }
}


class NoSpacesAround extends Term {
    constructor (...terms) {
        super(...terms);
    }

    listenError (callback) {
        const ctx = this.ctx;
        const token = ctx.start || ctx.symbol;
        const _nextToken = nextToken(ctx);
        const _prevToken = prevToken(ctx);

        if (!(_nextToken.start - token.stop <= 1 && token.start - _prevToken.stop <= 1)) {
            callback && callback(ctx, 'Before and after this construction spaces is not allowed.');
        }
    }
}


class SpaceAroundOrNot extends Term {
    constructor (...terms) {
        super(...terms);
    }

    listenError (callback) {
        const ctx = this.ctx;
        const token = ctx.start || ctx.symbol;
        const _nextToken = nextToken(ctx);
        const _prevToken = prevToken(ctx);

        const hasNoSpacesAround = _nextToken.start - token.stop === 1 && token.start - _prevToken.stop === 1;
        const hasSpacesAround = _nextToken.start - token.stop === 2 && token.start - _prevToken.stop === 2;

        if (!hasNoSpacesAround && !hasSpacesAround) {
            callback && callback(ctx, 'Use the same amount of whitespace on either side of an operator.');
        }
    }
}


class SpaceAround extends Term {
    constructor (...terms) {
        super(...terms);
    }

    listenError (callback) {
        const ctx = this.ctx;
        const token = ctx.start || ctx.symbol;
        const _nextToken = nextToken(ctx);
        const _prevToken = prevToken(ctx);

        const hasSpacesAround = _nextToken.start - token.stop === 2 && token.start - _prevToken.stop === 2;

        if (!hasSpacesAround) {
            callback && callback(ctx, 'Use the one space on either side of an operator.');
        }
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
    const tokenIndex = tokenList.indexOf(token);

    let prevTokenIndex = tokenIndex - 1;
    while (prevTokenIndex >= 0 && tokenList[prevTokenIndex].channel !== 0) {
        prevTokenIndex -= 1;
    }

    return tokenList[prevTokenIndex];
}

function nextToken(ctx) {
    const token = ctx.start || ctx.symbol;
    const tokenList = tokens(ctx);
    const tokenIndex = tokenList.indexOf(token);

    let nextTokenIndex = tokenIndex + 1;
    while (nextTokenIndex < tokenList.length && tokenList[nextTokenIndex].channel !== 0) {
        nextTokenIndex += 1;
    }

    return tokenList[nextTokenIndex];
}

function once(callback) {
    let callsCount = 0;

    return (...args) => callsCount++ === 0 && callback(...args);
}


module.exports = { StatementsIndentValidator, Rule, Term };
