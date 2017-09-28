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
        const functionHasBlock = lastNode.getText() !== ';';
        const blockIsEmpty = _.size(lastNode.children) === 2;

        if (functionHasBlock && !blockIsEmpty) {
            ctx.funcScope = new FunctionScope();
        }
    }

    enterParameter(ctx) {
        if (this._isReturnParams(ctx)) {
            return;
        }

        this._addVariable(ctx);
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
        const funcScope = ctx.funcScope;

        if (funcScope) {
            funcScope
                .unusedVariables()
                .forEach(({name, ctx}) =>
                    this.warn(ctx, 'no-unused-vars', `Variable "${name}" is unused`)
                );
        }
    }

    _addVariable(ctx) {
        const idNode = typeOf(ctx) === 'identifier' && ctx || traversing.findTypeInChildren(ctx, 'IdentifierContext');
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

    _isVarDeclaration(ctx) {
        const variableDeclaration = traversing.findParentType(ctx, 'VariableDeclarationContext');
        const identifierList = traversing.findParentType(ctx, 'IdentifierListContext');
        const parameterList = traversing.findParentType(ctx, 'ParameterListContext');

        return variableDeclaration || identifierList || parameterList;
    }

    _isReturnParams(ctx) {
        return traversing.findParentType(ctx, 'ReturnParametersContext');
    }

    _functionScope (ctx) {
        const functionNode = traversing.findParentType(ctx, 'FunctionDefinitionContext');
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


module.exports = NoUnusedVarsChecker;