const Reporter = require('./../../reporter');
const TreeTraversing = require('./../../common/tree-traversing');


const SEVERITY = Reporter.SEVERITY;
const traversing = new TreeTraversing();


class FunctionOrderChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterContractDefinition(ctx) {
        this._assignOrderAnalysisTo(ctx);
    }

    enterStructDefinition(ctx) {
        this._assignOrderAnalysisTo(ctx);
    }

    _assignOrderAnalysisTo(ctx) {
        const nameCtx = ctx.children[1];
        ctx.funcOrderAnalysis = new FunctionOrderAnalysis(nameCtx.getText(), this.reporter);
    }

    exitFunctionDefinition(ctx) {
        const contract = traversing.findParentType(ctx, 'ContractDefinitionContext');
        contract.funcOrderAnalysis.process(ctx);
    }

}


class State {

    constructor(config) {
        this.name = config.name;
        this.after = config.after;
        this.rules = config.rules;
    }

    nextState(name) {
        const items = this
            .rules
            .filter(i => i.on === name)
            .map(i => i.goTo);

        return (items.length > 0) ? items[0] : null;
    }

}

const STATES = {
    'START': new State({ name: 'START', after: '', rules: [
        { on: 'constructor', goTo: 'AFTER_CONSTR' },
        { on: 'fallback', goTo: 'AFTER_FALLBACK' },
        { on: 'external', goTo: 'AFTER_EXTERNAL' },
        { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
        { on: 'public', goTo: 'AFTER_PUBLIC' },
        { on: 'internal', goTo: 'AFTER_INTERNAL' },
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]}),

    'AFTER_CONSTR': new State({ name: 'AFTER_CONSTR', after: 'constructor', rules: [
        { on: 'fallback', goTo: 'AFTER_FALLBACK' },
        { on: 'external', goTo: 'AFTER_EXTERNAL' },
        { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
        { on: 'public', goTo: 'AFTER_PUBLIC' },
        { on: 'internal', goTo: 'AFTER_INTERNAL' },
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]}),

    'AFTER_FALLBACK': new State({ name: 'AFTER_CONSTR', after: 'fallback', rules: [
        { on: 'external', goTo: 'AFTER_EXTERNAL' },
        { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
        { on: 'public', goTo: 'AFTER_PUBLIC' },
        { on: 'internal', goTo: 'AFTER_INTERNAL' },
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]}),

    'AFTER_EXTERNAL': new State({ name: 'AFTER_EXTERNAL', after: 'external', rules: [
        { on: 'external', goTo: 'AFTER_EXTERNAL' },
        { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
        { on: 'public', goTo: 'AFTER_PUBLIC' },
        { on: 'internal', goTo: 'AFTER_INTERNAL' },
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]}),

    'AFTER_EXTERNAL_CONSTANT': new State({ name: 'AFTER_EXTERNAL_CONSTANT', after: 'external constant', rules: [
        { on: 'external_const', goTo: 'AFTER_EXTERNAL_CONSTANT' },
        { on: 'public', goTo: 'AFTER_PUBLIC' },
        { on: 'internal', goTo: 'AFTER_INTERNAL' },
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]}),

    'AFTER_PUBLIC': new State({ name: 'AFTER_PUBLIC', after: 'public', rules: [
        { on: 'public', goTo: 'AFTER_PUBLIC' },
        { on: 'internal', goTo: 'AFTER_INTERNAL' },
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]}),

    'AFTER_INTERNAL': new State({ name: 'AFTER_INTERNAL', after: 'internal', rules: [
        { on: 'internal', goTo: 'AFTER_INTERNAL' },
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]}),

    'AFTER_PRIVATE': new State({ name: 'AFTER_PRIVATE', after: 'private', rules: [
        { on: 'private', goTo: 'AFTER_PRIVATE' }
    ]})
};


class FunctionOrderAnalysis {

    constructor(contractName, reporter) {
        this.curState = STATES['START'];
        this.reporter = reporter;
        this.contractName = contractName;
        this.funcTypeParser = new FuncTypeParser(contractName);
    }

    process (ctx) {
        const name = this.funcTypeParser.funcType(ctx);
        const newState = this.curState.nextState(name);

        if (newState) {
            this.curState = STATES[newState];
        } else {
            this.reporter.addMessage(
                ctx.getSourceInterval(), SEVERITY.ERROR,
                `Function order is incorrect, ${name} function can not go after ${this.curState.after} function.`,
                'func-order'
            );
        }
    }

}


class FuncTypeParser {

    constructor (contractName) {
        this.contractName = contractName;
    }

    funcType (ctx) {
        if (ctx.children && ctx.children[1].constructor.name === 'IdentifierContext') {
            const funcName = ctx.children[1];

            if (funcName.getText() === this.contractName) {
                return 'constructor';
            } else {
                return this.funcModifierType(ctx);
            }
        } else {
            return 'fallback';
        }
    }

    funcModifierType (ctx) {
        const modifiers = ctx.children[3];
        const text = modifiers.getText();

        if (text.includes('external') && text.includes('constant')) {
            return 'external constant';
        }

        if (text.includes('external')) {
            return 'external';
        }

        if (text.includes('private')) {
            return 'private';
        }

        if (text.includes('internal')) {
            return 'internal';
        }

        return 'public';
    }

}


module.exports = FunctionOrderChecker;