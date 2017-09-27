const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('./common/asserts');
const { noIndent } = require('./common/configs');
const linter = require('./../lib/index');
const { contractWith } = require('./common/contract-builder');


describe('Linter', function() {
    describe('Best Practises Rules', function () {

        it('should raise warn when fallback is not payable', function () {
            const code = contractWith('function () public {}');

            const report = linter.processStr(code, noIndent());

            assertWarnsCount(report, 1);
            assertErrorMessage(report, 'payable');
        });

        it('should not raise warn when fallback is payable', function () {
            const code = contractWith('function () public payable {}');

            const report = linter.processStr(code, noIndent());

            assertNoWarnings(report);
        });

    });
});