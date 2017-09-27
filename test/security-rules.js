const assert = require('assert');
const linter = require('./../lib/index');
const contractWith = require('./common/contract-builder').contractWith;
const funcWith = require('./common/contract-builder').funcWith;
const { noIndent } = require('./common/configs');
const { assertWarnsCount, assertErrorMessage } = require('./common/asserts');


describe('Linter', function() {
    describe('SecurityRules', function() {

        it('should return pragma error', function() {
            const report = linter.processStr('pragma solidity ^0.4.4;');

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('Compiler'));
        });

        it('should return compiler version error', function () {
            const report = linter.processStr('pragma solidity 0.3.4;');

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('0.4'));
        });

        it('should return "send" call verification error', function () {
            const code = funcWith('x.send(55);');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('send'));
        });

        it('should return "call.value" verification error', function () {
            const code = funcWith('x.call.value(55)();');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('call.value'));
        });

        it('should return required visibility error', function () {
            const code = contractWith('function b() { }');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('visibility'));
        });

        it('should return required visibility error for state', function () {
            const code = contractWith('uint a;');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('visibility'));
        });

        it('should return that fallback must be simple', function () {
            const code = contractWith(`function () public payable {
                make1(); 
                make2(); 
                make3();
            }`);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('Fallback'));
        });

        it('should return error that function and event names are similar', function () {
            const code = contractWith(`
              event Name1();
              function name1() public payable { }
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('Event and function names must be different'));
        });

        it('should return error that function and event names are similar', function () {
            const code = contractWith(`
              function name1() public payable { }
              event Name1();
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('Event and function names must be different'));
        });

        // it('should return error that external contract is not marked as trusted / untrusted', function () {
        //     const code = funcWith('Bank.withdraw(100);');
        //
        //     const report = linter.processStr(code, config());
        //
        //     assert.equal(report.warningCount, 1);
        //     assert.ok(report.reports[0].message.includes('trusted'));
        // });

        const DEPRECATION_ERRORS = ['sha3("test");', 'throw;', 'suicide();'];

        DEPRECATION_ERRORS.forEach(curText =>
            it(`should return error that used deprecations ${curText}`, function () {
                const code = funcWith(curText);

                const report = linter.processStr(code, noIndent());

                assert.equal(report.errorCount, 1);
                assert.ok(report.reports[0].message.includes('deprecate'));
            }));

        it('should return error that multiple send calls used in transation', function () {
            const code = funcWith(`
              uint aRes = a.send(1); 
              uint bRes = b.send(2);
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('multiple'));
        });

        it('should return error that used tx.origin', function () {
            const code = funcWith(`
              uint aRes = tx.origin;
            `);

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assertErrorMessage(report, 'origin');
        });

        it('should return warn when business logic rely on time', function () {
            const code = funcWith(`
              now >= start + daysAfter * 1 days;
            `);

            const report = linter.processStr(code, noIndent());

            assertWarnsCount(report, 1);
            assertErrorMessage(report, 'time');
        });

    });
});