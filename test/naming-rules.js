const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('NamingRules', function () {

        it('should raise incorrect func name error', function () {
            const code = contractWith('function AFuncName () public {}');

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('camelCase'));
        });

        it('should dot raise incorrect func name error', function () {
            const code = contractWith('function aFunc1Nam23e () public {}');

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
});