const assert = require('assert');
const linter = require('./../lib/index');
const { funcWith } = require('./contract-builder');


describe('Linter', function() {
    describe('Expression Align Rules', function () {

        const incorrectExpressions = [
            'new  TrustedContract',
            'myArray[ 5 ]',
            'myFunc( 1, 2, 3 )',
            'myFunc. call(1)',
            'a = ( b + c )',
            'a=b + 1',
            'a+=1',
            'a ==b',
            '1** 2',
            'a &&b',
            'a > b ?a : b',
            '! a',
            'a ++'
        ];

        incorrectExpressions.forEach(curExpr =>
            it('should raise expression indentation error', function () {
                const code = funcWith(curExpr + ';');

                const report = linter.processStr(code, config());

                assert.equal(report.errorCount, 1);
                assert.ok(report.messages[0].message.includes('Expression indentation is incorrect'));
            }));

    });

    function config() {
        return {
            rules: { indent: false }
        };
    }
});