const BaseChecker = require('./../base-checker');
const naming = require('./../../common/identifier-naming');
const { typeOf } = require('./../../common/tree-traversing');


class FunctionParamNameStyleChecker extends BaseChecker {

    constructor(reporter) {
        super(reporter);
    }

    exitEventParameter(ctx) {
        this.exitParameter(ctx);
    }

    exitParameter(ctx) {
        let identifier = this.findIdentifier(ctx);

        if (identifier && naming.isNotMixedCase(identifier.getText())) {
            this._error(identifier);
        }
    }

    findIdentifier(ctx) {
        const children = ctx.children;

        const ids = children.filter(i => typeOf(i) === 'identifier');

        return (ids.length > 0) && ids[0];
    }

    _error(identifier) {
        this.error(identifier, 'func-param-name-mixedcase', 'Function param name must be in mixedCase');
    }
}


module.exports = FunctionParamNameStyleChecker;
