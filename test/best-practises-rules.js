const { assertNoWarnings, assertThatReportHas } = require('./common/asserts');
const assert = require('assert');
const linter = require('./../lib/index');
const { contractWith } = require('./common/contract-builder');


describe('Linter', function() {
    describe('Best Practises Rules', function () {

        it('should raise warn when fallback is not payable', function () {
            const code = contractWith('function () public {}');

            const report = linter.processStr(code, config());

            assert.equal(report.warningCount, 1);
            assertThatReportHas(report, 0, 'payable');
        });

        it('should not raise warn when fallback is payable', function () {
            const code = contractWith('function () public payable {}');

            const report = linter.processStr(code, config());

            assertNoWarnings(report);
        });

    });

    function config() {
        return {
            rules: { indent: false }
        };
    }

});