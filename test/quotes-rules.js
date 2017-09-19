const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('Quote Rules', function () {

        it('should raise quotes error', function () {
            const code = contractWith('string private a = \'test\';');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('double quotes'));
        });

    });

    function contractWith(code) {
        return `
          pragma solidity 0.4.4;
            
            
          contract A {
            ${code}
          }
        `;
    }
    //
    // function funcWith(statements) {
    //     return contractWith(`
    //       function b() public {
    //         ${statements}
    //       }
    //     `);
    // }
});