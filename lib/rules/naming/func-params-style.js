const BaseChecker = require('./../base-checker');
const naming = require('./../../common/identifier-naming');
const { typeOf } = require('./../../common/tree-traversing');


class FunctionParamNameStyleChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitParameter(ctx) {
        let identifier = this.findIdentifier(ctx);

        if (identifier && naming.isNotMixedCase(identifier.getText())) {
            this._error(identifier);
        }
    }

    findIdentifier(ctx) {
        const children = ctx.children;

        for (let i = 0; i < children.length; i += 1) {
            if (typeOf(children[i]) === 'identifier') {
                return children[i];
            }
        }

        return null;
    }

    _error(identifier) {
        this.error(identifier, 'func-param-name-mixedcase', 'Function param name must be in mixedCase');
    }
}


module.exports = FunctionParamNameStyleChecker;