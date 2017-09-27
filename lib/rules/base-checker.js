

class BaseChecker {

    constructor(reporter) {
        this.reporter = reporter;
    }

    error(ctx, ruleId, message) {
        this.reporter.error(ctx, ruleId, message);
    }

    warn(ctx, ruleId, message) {
        this.reporter.warn(ctx, ruleId, message);
    }

}


module.exports = BaseChecker;