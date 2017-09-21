const assert = require('assert');
const linter = require('./../lib/index');
const { funcWith } = require('./contract-builder');


describe('Linter', function() {
    describe('Expression Align Rules', function () {

        it('should raise error when "new" has more than one space', function () {
            const code = funcWith('new  TrustedContract;');

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Required space'));
        });

        it('should raise error when array access brackets has spaces', function () {
            const code = funcWith('myArray[ 5 ];');

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Expression indentation is incorrect'));
        });

    });

    function config() {
        return {
            rules: { indent: false }
        };
    }
});