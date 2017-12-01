const BaseChecker = require('./../base-checker');
const _ = require('lodash');
const TreeTraversing = require('./../../common/tree-traversing');
const { typeOf, hasMethodCalls, findPropertyInParents } = TreeTraversing;


class ReentrancyChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    enterContractDefinition(ctx) {
        ctx.stateDeclarationScope = new StateDeclarationScope();
        const scope = ctx.stateDeclarationScope;

        new ContractDefinition(ctx)
            .stateDefinitions()
            .forEach(i => scope.trackStateDeclaration(i));
    }

    enterFunctionDefinition(ctx) {
        ctx.effects = new Effects(StateDeclarationScope.of(ctx));
    }

    enterExpression(ctx) {
        this._checkAssignment(ctx);
        this._checkSendCall(ctx);
    }

    _checkAssignment(ctx) {
        const effects = Effects.of(ctx);
        const assignOperator = AssignOperator.of(ctx);

        if (assignOperator && effects && effects.isNotAllowed(assignOperator)) {
            this._warn(ctx);
        }
    }

    _checkSendCall(ctx) {
        if (hasMethodCalls(ctx, ['send', 'transfer'])) {
            Effects.of(ctx).trackTransfer();
        }
    }

    _warn(ctx) {
        this.warn(ctx, 'reentrancy', 'Possible reentrancy vulnerabilities. Avoid state changes after transfer.');
    }
}


class Effects {

    static of(ctx) {
        return findPropertyInParents(ctx, 'effects');
    }

    constructor(statesScope) {
        this.states = statesScope && statesScope.states;
        this.hasTransfer = false;
    }

    isNotAllowed(operator) {
        return this.hasTransfer && operator.modifyOneOf(this.states);
    }

    trackTransfer() {
        this.hasTransfer = true;
    }
}


class StateDeclarationScope {

    static of(ctx) {
        return findPropertyInParents(ctx, 'stateDeclarationScope');
    }

    constructor() {
        this.states = [];
    }

    trackStateDeclaration(stateDefinition) {
        const stateName = stateDefinition.stateName();
        this.states.push(stateName);
    }
}


class ContractDefinition {

    constructor(ctx) {
        this.ctx = ctx;
    }

    stateDefinitions() {
        return this.ctx
            .children
            .map(i => new ContractPart(i))
            .filter(i => i.isStateDefinition())
            .map(i => i.getStateDefinition());
    }
}


class ContractPart {

    constructor(ctx) {
        this.ctx = ctx;
    }

    isStateDefinition() {
        return typeOf(this._firstChild()) === 'stateVariableDeclaration';
    }

    getStateDefinition() {
        return new StateDefinition(this._firstChild());
    }

    _firstChild() {
        return _.first(this.ctx.children);
    }
}


class StateDefinition {

    constructor(ctx) {
        this.ctx = ctx;
    }

    stateName() {
        return _(this.ctx.children)
            .find(i => typeOf(i) === 'identifier')
            .getText();
    }
}


class AssignOperator {

    static of(ctx) {
        const hasThreeItems = _.size(ctx.children) === 3;
        const hasAssignOperator = ctx.children[1] && ctx.children[1].getText() === '=';

        if (hasThreeItems && hasAssignOperator) {
            return new AssignOperator(ctx);
        }
    }

    constructor(ctx) {
        this.ctx = ctx;
    }

    modifyOneOf(states) {
        const assigneeText = this._assignee().getText();

        return states.some(curStateName => assigneeText.includes(curStateName));
    }

    _assignee() {
        return this.ctx.children[0];
    }
}


module.exports = ReentrancyChecker;
