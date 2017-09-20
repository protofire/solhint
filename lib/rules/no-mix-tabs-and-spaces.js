const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class NoMixTabAndSpacesChecker {

    constructor(reporter, config={}) {
        this.reporter = reporter;

        const configDefined = config.rules && config.rules.indent && config.rules.indent[1];
        this.spacer = (configDefined && config.rules.indent[1] === 'tabs') && 'tabs' || 'spaces';
    }

    enterSourceUnit(ctx) {
        ctx.parser._input.tokenSource._input.strdata
            .split('\n')
            .map((i, index) => [i.replace(/[^\s]+.*/, ''), index])
            .filter(args => this.isMixTabsAndSpaces(args[0]))
            .forEach(args => this.makeReport(args[1]));
    }

    isMixTabsAndSpaces(prefixLine) {
        const disallowedSpacer = this.spacer === 'tabs' ? ' ' : '\t';

        return prefixLine.includes(disallowedSpacer);
    }

    makeReport(line) {
        this.reporter.addMessageExplicitLine(
            line + 1, 0, SEVERITY.ERROR,
            `Mixed tabs and spaces. Allowed only ${this.spacer}`, 'no-mix-tabs-and-spaces'
        );
    }

}


module.exports = NoMixTabAndSpacesChecker;

