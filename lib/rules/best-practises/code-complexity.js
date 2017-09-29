const BaseChecker = require('./../base-checker');
const { typeOf } = require('./../../common/tree-traversing');
const TreeTraversing = require('./../../common/tree-traversing');
const traversing = new TreeTraversing();
const _ = require('lodash');


class CodeComplexityChecker extends BaseChecker {

    constructor(reporter, config) {
        super(reporter);

        const configVal = _.get(config, 'rules["code-complexity"][1]');
        this.maxComplexity = (_.isNumber(configVal) && configVal > 0) ? configVal : 7;
    }

    enterFunctionDefinition (ctx) {
        this._attachComplexityScope(ctx);
    }

    enterModifierDefinition (ctx) {
        this._attachComplexityScope(ctx);
    }

    enterIfStatement (ctx) {
        this._incComplexity(ctx);
    }

    enterWhileStatement (ctx) {
        this._incComplexity(ctx);
    }

    enterDoWhileStatement (ctx) {
        this._incComplexity(ctx);
    }

    enterForStatement (ctx) {
        this._incComplexity(ctx);
    }

    exitFunctionDefinition (ctx) {
        this._verifyComplexityScope(ctx);
    }

    exitModifierDefinition (ctx) {
        this._verifyComplexityScope(ctx);
    }

    _attachComplexityScope (ctx) {
        const lastNode = _.last(ctx.children);
        const funcWithoutBlock = isFuncWithoutBlock(lastNode);
        const emptyBlock = isEmptyBlock(lastNode);

        ignoreWhen(funcWithoutBlock, emptyBlock) || ComplexityScope.activate(ctx);
    }

    _incComplexity (ctx) {
        const scope = ComplexityScope.of(ctx);
        if (scope) {
            scope.incComplexity();
        } else {
            console.log(ctx.getText());
        }
    }

    _verifyComplexityScope (ctx) {
        const scope = ComplexityScope.of(ctx);

        if (scope && scope.complexity > this.maxComplexity) {
            this.error(ctx, scope);
        }
    }

    error(ctx, scope) {
        const curComplexity = scope.complexity;
        const maxComplexity = this.maxComplexity;

        const message = `Function has cyclomatic complexity ${curComplexity} but allowed no more than ${maxComplexity}`;
        super.warn(ctx, 'code-complexity', message);
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

    static isActivated(ctx) {
        return !!ctx.complexityScope;
    }

    constructor() {
        this.complexity = 1;
    }

    incComplexity () {
        this.complexity += 1;
    }
}


function isEmptyBlock(node) {
    const OPEN_CLOSE_BRACKETS_LENGTH = 2;
    return _.size(node.children) === OPEN_CLOSE_BRACKETS_LENGTH;
}


function isFuncWithoutBlock (node) {
    return node.getText() === ';';
}


function ignoreWhen(...args) {
    return _.some(args);
}


function typeName (type) {
    return type[0].toUpperCase() + type.substring(1) + 'Context';
}


function findParentType(ctx, type) {
    return traversing.findParentType(ctx, typeName(type));
}


module.exports = CodeComplexityChecker;
