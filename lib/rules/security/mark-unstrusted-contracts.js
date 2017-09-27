const TreeTraversing = require('./../../common/tree-traversing');
const Reporter = require('./../../reporter');


const traversing = new TreeTraversing();
const SEVERITY = Reporter.SEVERITY;

class MarkUntrustedContractsChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    exitIdentifier(ctx) {
        const identifier = ctx.getText();
        const isFirstCharUpper = /[A-Z]/.test(identifier[0]);
        const isContainsTrustInfo = identifier.toLowerCase().includes('trust');
        const isStatement = traversing.findParentType(ctx, 'StatementContext');

        if (isFirstCharUpper && !isContainsTrustInfo && isStatement) {
            this.reporter.addMessage(
                ctx.getSourceInterval(), SEVERITY.WARN,
                'Explicitly mark all external contracts as trusted or untrusted', 'mark-callable-contracts'
            );
        }
    }

}


module.exports = MarkUntrustedContractsChecker;