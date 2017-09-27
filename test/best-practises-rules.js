const { assertNoWarnings, assertThatReportHas, assertWarnsCount } = require('./common/asserts');
const { noIndent } = require('./common/configs');
const linter = require('./../lib/index');
const { contractWith } = require('./common/contract-builder');


describe('Linter', function() {
    describe('Best Practises Rules', function () {

        it('should raise warn when fallback is not payable', function () {
            const code = contractWith('function () public {}');

            const report = linter.processStr(code, noIndent());

            assertWarnsCount(report, 1);
            assertThatReportHas(report, 0, 'payable');
        });

        it('should not raise warn when fallback is payable', function () {
            const code = contractWith('function () public payable {}');

            const report = linter.processStr(code, noIndent());

            assertNoWarnings(report);
        });

    });
});