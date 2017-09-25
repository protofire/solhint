const assert = require('assert');
const linter = require('./../lib/index');
const { contractWith, funcWith } = require('./contract-builder');


describe('Linter', function() {
    describe('Quote Rules', function () {

        it('should raise quotes error', function () {
            const code = contractWith('string private a = \'test\';');

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('double quotes'));
        });

        it('should raise quotes error in import', function () {
            const code = 'import * from \'lib.sol\';';

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('double quotes'));
        });

        it('should raise quotes error in import for custom rules', function () {
            const code = 'import * from "lib.sol";';

            const report = linter.processStr(code, { rules: { quotes: ['error', 'single'] } });

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('single quotes'));
        });

        it('should raise quotes error in import for custom rules', function () {
            const code = 'import * from "lib.sol";';

            const report = linter.processStr(code, { rules: { quotes: ['error', 'single'] } });

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('single quotes'));
        });

        it('should raise quotes error in import for complex import', function () {
            const code = 'import {a as b, c as d} from \'lib.sol\';';

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('double quotes'));
        });

        it('should raise quotes error in assembly clause', function () {
            const code = funcWith('assembly { \'abc\' }');

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('double quotes'));
        });

    });

    function config() {
        return {
            rules: { indent: false }
        };
    }

});