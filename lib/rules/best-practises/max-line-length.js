const BaseChecker = require('./../base-checker');
const _ = require('lodash');


class MaxLineLengthChecker extends BaseChecker {

    constructor(reporter, config={}) {
        super(reporter);

        const rules = config.rules;
        const isConfigExists = rules && rules['max-line-length'] && _.isNumber(rules['max-line-length'][1]);

        const lengthFromConfig = isConfigExists && rules['max-line-length'][1];
        this.maxLength = lengthFromConfig || 120;
    }

    enterSourceUnit (ctx) {
        const lines = ctx.parser._input.tokenSource._input.strdata.split('\n');

        lines
            .map(line => line.length)
            .forEach(this.validateLineLength.bind(this));
    }

    validateLineLength (curLength, lineNum) {
        if (curLength > this.maxLength) {
            const message = `Line length must be no more than ${this.maxLength} but current length is ${curLength}.`;
            this.reporter.errorAt(lineNum + 1, 1, 'max-line-length', message);
        }
    }

}


module.exports = MaxLineLengthChecker;