const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('#parseStr', function() {

        it('should return pragma error', function() {
            const report = linter.processStr('pragma solidity ^0.4.4;');

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('Compiler'));
        });

        it('should return compiler version error', function () {
            const report = linter.processStr('pragma solidity ^0.3.4;');

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('Compiler'));
        });

        it('should return "send" call verification error', function () {
            const code = funcWith('x.send(55);');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('send'));
        });

        it('should return "call.value" verification error', function () {
            const code = funcWith('x.call.value(55)();');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('call.value'));
        });

        it('should return required visibility error', function () {
            const code = contractWith('function b() { }');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('visibility'));
        });

        it('should return that fallback must be simple', function () {
            const code = contractWith(`function () payable public {
                make1(); 
                make2(); 
                make3();
            }`);

            const report = linter.processStr(code);

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('Fallback'));
        });

        it('should return error that function and event names are similar', function () {
            const code = contractWith(`
              event Name1();
              function name1() payable public { }
            `);

            const report = linter.processStr(code);

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('Event and function names must be different'));
        });

        it('should return error that external contract is not marked as trusted / untrusted', function () {
            const code = funcWith('Bank.withdraw(100);');

            const report = linter.processStr(code);

            assert.equal(report.warningCount, 1);
            assert.ok(report.reports[0].message.includes('trusted'));
        });

        it('should return error that used deprecations', function () {
            const code = funcWith('sha3("test");');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('sha3'));
        });

        it('should return error that multiple send calls used in transation', function () {
            const code = funcWith(`
              uint a_res = a.send(1); 
              uint b_res = b.send(2);
            `);

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('multiple'));
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

    function funcWith(statements) {
        return contractWith(`
          function b() public {
            ${statements}
          }
        `);
    }
});