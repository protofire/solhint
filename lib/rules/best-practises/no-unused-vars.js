const BaseChecker = require('./../base-checker');
const TreeTraversion = require('./../../common/tree-traversing');
const traversing = new TreeTraversion();
const { typeOf } = TreeTraversion;
const _ = require('lodash');


class NoUnusedVarsChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    enterFunctionDefinition(ctx) {
        // functionDefinition : 'function' identifier? parameterList modifierList returnParameters? ( ';' | block ) ;
        const lastNode = _.last(ctx.children);
        const isFuncWithoutBlock = lastNode.getText() === ';';

        ignoreWhen(isFuncWithoutBlock, isEmptyBlock(lastNode)) || activateVarUsageValidation(ctx);
    }

    enterParameter(ctx) {
        ignoreWhen(isReturnParams(ctx)) || this._addVariable(ctx);
    }

    enterVariableDeclaration(ctx) {
        this._addVariable(ctx);
    }

    enterIdentifierList(ctx) {
        for (let curId of traversing.findIdentifier(ctx)) {
            this._addVariable(curId);
        }
    }

    enterIdentifier(ctx) {
        this._trackVarUsage(ctx);
    }

    exitFunctionDefinition(ctx) {
        const isValidationActivated = !!ctx.funcScope;
        isValidationActivated && this._reportErrors(ctx);
    }

    _addVariable(ctx) {
        const isCtxIdentifier = (typeOf(ctx) === 'identifier');
        const idNode = isCtxIdentifier ? ctx : findTypeInChildren(ctx, 'identifier');
        const funcScope = this._functionScope(ctx);

        if (idNode && funcScope) {
            funcScope.addVar(idNode, idNode.getText());
        }
    }

    _trackVarUsage(ctx) {
        const isFunctionName = typeOf(ctx.parentCtx) === 'functionDefinition';
        const funcScope = this._functionScope(ctx);

        if (funcScope && !this._isVarDeclaration(ctx) && !isFunctionName) {
            funcScope.trackVarUsage(ctx.getText());
        }
    }

    _reportErrors(ctx) {
        ctx
            .funcScope
            .unusedVariables()
            .forEach(this._error.bind(this));
    }

    _error({name, ctx}) {
        this.warn(ctx, 'no-unused-vars', `Variable "${name}" is unused`);
    }

    _isVarDeclaration(ctx) {
        const variableDeclaration = findParentType(ctx, 'variableDeclaration');
        const identifierList = findParentType(ctx, 'identifierList');
        const parameterList = findParentType(ctx, 'parameterList');

        return variableDeclaration || identifierList || parameterList;
    }

    _functionScope (ctx) {
        const functionNode = findParentType(ctx, 'functionDefinition');
        return functionNode ? functionNode.funcScope : null;
    }
}


class FunctionScope {

    constructor() {
        this.vars = {};
    }

    addVar(ctx, name) {
        this.vars[name] = { ctx: ctx, usage: 0 };
    }

    trackVarUsage(name) {
        const curVar = this.vars[name];

        curVar && (curVar.usage += 1);
    }

    unusedVariables() {
        return _(this.vars)
            .pickBy(val => val.usage === 0)
            .map((info, varName) => ({ name: varName, ctx: info.ctx }))
            .value();
    }
}


function isEmptyBlock(node) {
    const OPEN_CLOSE_BRACKETS_LENGTH = 2;
    return _.size(node.children) === OPEN_CLOSE_BRACKETS_LENGTH;
}


function ignoreWhen(...args) {
    return _.some(args);
}


function activateVarUsageValidation (ctx) {
    ctx.funcScope = new FunctionScope();
}


function isReturnParams(ctx) {
    return findParentType(ctx, 'returnParameters');
}


function typeName (type) {
    return type[0].toUpperCase() + type.substring(1) + 'Context';
}


function findParentType(ctx, type) {
    return traversing.findParentType(ctx, typeName(type));
}


function findTypeInChildren(ctx, type) {
    return traversing.findTypeInChildren(ctx, typeName(type));
}


module.exports = NoUnusedVarsChecker;