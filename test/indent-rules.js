const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('Indent Rules', function () {

        it('should raise error when contract do not surrounds with two blank lines', function () {
            const code = `
            contract A {}
            
            contract B {}
            `;

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 2);
            assert.ok(report.messages[0].message.includes('two blank'));
        });

        it('should not raise error when contract do not surrounds with two blank lines', function () {
            const code = `
            contract A {}
            
            
            contract B {}
            
            
            contract C {}
            `;

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 0);
        });


    });

    // function contractWith(code) {
    //     return `
    //       pragma solidity 0.4.4;
    //
    //       contract A {
    //         ${code}
    //       }
    //     `;
    // }
    //
    // function funcWith(statements) {
    //     return contractWith(`
    //       function b() public {
    //         ${statements}
    //       }
    //     `);
    // }
});