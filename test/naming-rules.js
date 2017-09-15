const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('NamingRules', function () {

        it('should raise incorrect func name error', function () {
            const code = contractWith('function AFuncName () public {}');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('mixedCase'));
        });

        it('should dot raise incorrect func name error', function () {
            const code = contractWith('function aFunc1Nam23e () public {}');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 0);
        });

        it('should raise incorrect func param name error', function () {
            const code = contractWith('function funcName (uint A) public {}');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('param'));
        });

        it('should raise incorrect var name error', function () {
            const code = funcWith('var (a, B);');

            const report = linter.processStr(code);

            assert.ok(report.errorCount > 0);
            assert.ok(report.messages.map(i => i.message).some(i => i.includes('name')));
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