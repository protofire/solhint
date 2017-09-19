const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('Ordering Rules', function () {

        it('should raise visibility modifier error', function () {
            const code = contractWith('function a() ownable() public payable {}');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Visibility'));
        });

        it('should raise impoty not on top error', function () {
            const code = `
                contract A {}
                
                
                import 'lib.sol';
            `;

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Import'));
        });

        it('should not raise impoty not on top error', function () {
            const code = `
                pragma solidity 0.4.17;
                import 'lib.sol';
                
                
                contract A {}
            `;

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 0);
        });

        it('should raise incorrect function order error', function () {
            const code = contractWith(`
                function b() private {}
                function () public payable {}
            `);

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Function order is incorrect'));
        });

        it('should raise incorrect function order error for external constant funcs', function () {
            const code = contractWith(`
                function b() external constant {}
                function c() external {}
            `);

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Function order is incorrect'));
        });

        it('should not raise incorrect function order error', function () {
            const code = contractWith(`
                function A() public {}
                function () public payable {}
            `);

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 0);
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