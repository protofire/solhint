const Reporter = require('./../reporter');
const SEVERITY = Reporter.SEVERITY;
const _ = require('lodash');


class MaxLineLengthChecker {

    constructor(reporter, config={}) {
        this.reporter = reporter;

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
            this.reporter.addMessageExplicitLine(
                lineNum + 1, 1, SEVERITY.ERROR,
                `Line length must be no more than ${this.maxLength} but current length is ${curLength}.`,
                'max-line-length'
            );
        }
    }

}


module.exports = MaxLineLengthChecker;