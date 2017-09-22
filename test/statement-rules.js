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
            'for (uint i = 0;a < b; i += 1) {}',
            'if (a < b) {\n' +
            '  test1(); \n' +
            '} \n' +
            'else {\n' +
            '  test2();\n' +
            '}',
            'do { \n' +
            '  test1(); \n' +
            '} \n' +
            'while (a < b); \n'
        ];

        INCORRECT_STATEMENTS.forEach(curStatement =>
            it(`${label(curStatement)} should raise statement indentation error`, function () {
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
            'for (uint i = 0; a < b; i += 1) {}',
            'if (a < b) {\n' +
            '  test1(); \n' +
            '} else {\n' +
            '  test2();\n' +
            '}',
            'do { \n' +
            '  test1(); \n' +
            '} while (a < b); \n'
        ];

        CORRECT_STATEMENTS.forEach(curStatement =>
            it(`${label(curStatement)} should not raise statement indentation error`, function () {
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

    function label (data) {
        return data.split('\n')[0];
    }
});