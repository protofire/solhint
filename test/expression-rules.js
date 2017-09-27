const assert = require('assert');
const linter = require('./../lib/index');
const { funcWith } = require('./common/contract-builder');


describe('Linter - Expression Align Rules', function() {

    describe('Incorrect Expressions', function () {
        const INCORRECT_EXPRESSIONS = [
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
            'a ++',
            'a +=1'
        ];

        INCORRECT_EXPRESSIONS.forEach(curExpr =>
            it(`should raise expression indentation error for ${curExpr}`, function () {
                const code = funcWith(curExpr + ';');

                const report = linter.processStr(code, config());

                assert.equal(report.errorCount, 1);
                assert.ok(report.messages[0].message.includes('Expression indentation is incorrect'));
            })
        );
    });

    describe('Correct Expressions', function () {
        const CORRECT_EXPRESSIONS = [
            'new TrustedContract',
            'myArray[5]',
            'myFunc(1, 2, 3)',
            'myFunc.call(1)',
            'a = (b + c)',
            'a = b + 1',
            'a += 1',
            'a == b',
            '1**2',
            'a && b',
            'a > b ? a : b',
            '!a',
            'a++',
            'a += 1',
            'a += (b + c) * d',
            'bytesStringTrimmed[j] = bytesString[j]'
        ];

        CORRECT_EXPRESSIONS.forEach(curExpr =>
            it(`should not raise expression indentation error for ${curExpr}`, function () {
                const code = funcWith(curExpr + ';');

                const report = linter.processStr(code, config());

                assert.equal(report.errorCount, 0);
            })
        );
    });

    function config() {
        return {
            rules: { indent: false }
        };
    }
});