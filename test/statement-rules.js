const assert = require('assert');
const linter = require('./../lib/index');
const { funcWith } = require('./contract-builder');


describe('Linter - Statement Align Rules', function() {

    describe('Incorrect Statements', function () {
        const INCORRECT_STATEMENTS = [
            'if(a > b) {}',
            'if (a > b ) {} else {}',
            'while ( a > b) {}',
            'do {} while (a > b );',
            'for ( ;;) {}',
            'for (uint i = 0; ;) {}',
            'for ( ;a < b;) {}',
            'for (;;i += 1) {}',
            'for (uint i = 0;;i += 1) {}',
            'for (uint i = 0;i += 1;) {}',
            'for (;a < b; i += 1) {}',
            'for (uint i = 0;a < b; i += 1) {}'
        ];

        INCORRECT_STATEMENTS.forEach(curStatement =>
            it(`${curStatement} should raise statement indentation error`, function () {
                const code = funcWith(curStatement);

                const report = linter.processStr(code, config());

                assert.equal(report.errorCount, 1);
                assert.ok(report.messages[0].message.includes('Statement indentation is incorrect'));
            })
        );
    });

    describe('Correct Statements', function () {
        const CORRECT_STATEMENTS = [
            'if (a > b) {}',
            'if (a > b) {} else {}',
            'while (a > b) {}',
            'do {} while (a > b);',
            'for (;;) {}',
            'for (uint i = 0;;) {}',
            'for (; a < b;) {}',
            'for (;; i += 1) {}',
            'for (uint i = 0;; i += 1) {}',
            'for (uint i = 0; i += 1;) {}',
            'for (; a < b; i += 1) {}',
            'for (uint i = 0; a < b; i += 1) {}'
        ];

        CORRECT_STATEMENTS.forEach(curStatement =>
            it(`${curStatement} should not raise statement indentation error`, function () {
                const code = funcWith(curStatement);

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