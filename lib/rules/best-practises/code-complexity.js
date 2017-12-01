const BaseChecker = require('./../base-checker');


class CodeComplexityChecker extends BaseChecker {

    constructor(reporter, config) {
        super(reporter);

        this.maxComplexity = config.getNumber('code-complexity', 7);
    }

    enterFunctionDefinition(ctx) {
        this._attachComplexityScope(ctx);
    }

    enterModifierDefinition(ctx) {
        this._attachComplexityScope(ctx);
    }

    enterIfStatement(ctx) {
        this._complexityPlusOne(ctx);
    }

    enterWhileStatement(ctx) {
        this._complexityPlusOne(ctx);
    }

    enterDoWhileStatement(ctx) {
        this._complexityPlusOne(ctx);
    }

    enterForStatement(ctx) {
        this._complexityPlusOne(ctx);
    }

    exitFunctionDefinition(ctx) {
        this._verifyComplexityScope(ctx);
    }

    exitModifierDefinition(ctx) {
        this._verifyComplexityScope(ctx);
    }

    _attachComplexityScope(ctx) {
        ComplexityScope.activate(ctx);
    }

    _complexityPlusOne(ctx) {
        const scope = ComplexityScope.of(ctx);
        scope && scope.complexityPlusOne();
    }

    _verifyComplexityScope(ctx) {
        const scope = ComplexityScope.of(ctx);

        if (scope && scope.complexity > this.maxComplexity) {
            this.error(ctx, scope);
        }
    }

    error(ctx, scope) {
        const curComplexity = scope.complexity;
        const maxComplexity = this.maxComplexity;

        const message = `Function has cyclomatic complexity ${curComplexity} but allowed no more than ${maxComplexity}`;
        super.error(ctx, 'code-complexity', message);
    }
}


class ComplexityScope {

    static of(ctx) {
        let curCtx = ctx;

        while (curCtx && !curCtx.complexityScope) {
            curCtx = curCtx.parentCtx;
        }

        return curCtx && curCtx.complexityScope;
    }

    static activate(ctx) {
        ctx.complexityScope = new ComplexityScope();
    }

    constructor() {
        this.complexity = 1;
    }

    complexityPlusOne() {
        this.complexity += 1;
    }
}


module.exports = CodeComplexityChecker;
