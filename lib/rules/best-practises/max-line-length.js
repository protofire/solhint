const BaseChecker = require('./../base-checker');


class MaxLineLengthChecker extends BaseChecker {

    constructor(reporter, config) {
        super(reporter);

        this.maxLength = config.getNumber('max-line-length', 120);
    }

    enterSourceUnit(ctx) {
        const lines = ctx.parser._input.tokenSource._input.strdata.split('\n');

        lines
            .map(line => line.length)
            .forEach(this.validateLineLength.bind(this));
    }

    validateLineLength(curLength, lineNum) {
        if (curLength > this.maxLength) {
            const message = `Line length must be no more than ${this.maxLength} but current length is ${curLength}.`;
            this.reporter.errorAt(lineNum + 1, 1, 'max-line-length', message);
        }
    }

}


module.exports = MaxLineLengthChecker;