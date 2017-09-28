const BaseChecker = require('./../base-checker');


class NoMixTabAndSpacesChecker extends BaseChecker {

    constructor(reporter, config) {
        super(reporter);

        const configDefined = config.rules && config.rules.indent && config.rules.indent[1];
        this.spacer = (configDefined && config.rules.indent[1] === 'tabs') && 'tabs' || 'spaces';
    }

    enterSourceUnit(ctx) {
        ctx.parser._input.tokenSource._input.strdata
            .split('\n')
            .map((i, index) => [i.replace(/[^\s]+.*/, ''), index])
            .filter(args => this.isMixTabsAndSpaces(args[0]))
            .forEach(args => this._error(args[1]));
    }

    isMixTabsAndSpaces(prefixLine) {
        const disallowedSpacer = this.spacer === 'tabs' ? ' ' : '\t';

        return prefixLine.includes(disallowedSpacer);
    }

    _error(line) {
        const message = `Mixed tabs and spaces. Allowed only ${this.spacer}`;
        this.reporter.errorAt(line + 1, 0, 'no-mix-tabs-and-spaces', message);
    }

}


module.exports = NoMixTabAndSpacesChecker;

