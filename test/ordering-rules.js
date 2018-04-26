const assert = require('assert');
const linter = require('./../lib/index');
const contractWith = require('./common/contract-builder').contractWith;
const { noIndent } = require('./common/configs');


describe('Linter', function () {
    describe('Ordering Rules', function () {

        it('should raise visibility modifier error', function () {
            const code = contractWith('function a() ownable() public payable {}');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Visibility'));
        });

        it('should raise import not on top error', function () {
            const code = `
              contract A {}


              import "lib.sol";
            `;

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Import'));
        });

        it('should not raise import not on top error', function () {
            const code = `
                pragma solidity 0.4.17;
                import "lib.sol";


                contract A {}
            `;

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 0);
        });

        it('should raise incorrect function order error', function () {
            const code = contractWith(`
                function b() private {}
                function () public payable {}
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Function order is incorrect'));
        });

        it('should raise incorrect function order error for external constant funcs', function () {
            const code = contractWith(`
                function b() external pure {}
                function c() external {}
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Function order is incorrect'));
        });

        it('should raise incorrect function order error for internal function', function () {
            const code = contractWith(`
                function c() internal {}
                function b() external view {}
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Function order is incorrect'));
        });

        it('should not raise incorrect function order error', function () {
            const code = contractWith(`
                function A() public {}
                function () public payable {}
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 0);
        });

        it('should not raise incorrect function order error', function () {
            const code = contractWith(`
                constructor() public {}
                function () public payable {}
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 0);
        });

        it('should raise incorrect function order error', function () {
            const code = contractWith(`
                function () public payable {}
                constructor() public {}
            `);

            const report = linter.processStr(code, noIndent());
            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Function order is incorrect'));
        });

        it('should not raise error when external const goes before public ', function () {
            const code = contractWith(`
                function a() external view {}
                function b() public {}
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 0);
        });

    });
});
