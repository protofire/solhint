const Reporter = require('./../reporter');


const SEVERITY = Reporter.SEVERITY;

class NoMixTabAndSpacesChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    enterSourceUnit(ctx) {
        ctx.parser._input.tokenSource._input.strdata
            .split('\n')
            .map((i, index) => [i.replace(/[^\s]+.*/, ''), index])
            .filter(args => this.isMixTabsAndSpaces(args[0]))
            .forEach(args => this.makeReport(args[1]));
    }

    isMixTabsAndSpaces(prefixLine) {
        return (prefixLine.includes(' ') && prefixLine.includes('\t'));
    }

    makeReport(line) {
        this.reporter.addMessageExplicitLine(
            line + 1, 0, SEVERITY.ERROR,
            'Mixed tabs and spaces', 'no-mix-tabs-and-spaces'
        );
    }

}


module.exports = NoMixTabAndSpacesChecker;

