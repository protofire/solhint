const assert = require('assert');
const linter = require('./../lib/index');
const contractWith = require('./common/contract-builder').contractWith;
const funcWith = require('./common/contract-builder').funcWith;
const { noIndent } = require('./common/configs');


describe('Linter', function () {
    describe('NamingRules', function () {

        it('should raise incorrect func name error', function () {
            const code = contractWith('function AFuncName () public {}');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('mixedCase'));
        });

        it('should dot raise incorrect func name error', function () {
            const code = contractWith('function aFunc1Nam23e () public {}');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 0);
        });

        it('should raise incorrect func param name error', function () {
            const code = contractWith('function funcName (uint A) public {}');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('param'));
        });

        it('should raise incorrect var name error', function () {
            const code = funcWith('var (a, B);');

            const report = linter.processStr(code, noIndent());

            assert.ok(report.errorCount > 0);
            assert.ok(report.messages.map(i => i.message).some(i => i.includes('name')));
        });

        it('should raise incorrect var name error for typed declaration', function () {
            const code = funcWith('uint B = 1;');

            const report = linter.processStr(code, noIndent());

            assert.ok(report.errorCount > 0);
            assert.ok(report.messages.map(i => i.message).some(i => i.includes('name')));
        });

        it('should raise incorrect var name error for state declaration', function () {
            const code = contractWith('uint32 private D = 10;');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Variable name'));
        });

        it('should not raise var name error for constants', function () {
            const code = contractWith('uint32 private constant D = 10;');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 0);
        });

        it('should raise var name error for event arguments illegal styling', function () {
            const code = contractWith('event Event1(uint B);');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('mixedCase'));
        });

        it('should raise event name error for event in mixedCase', function () {
            const code = contractWith('event event1(uint a);');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('CamelCase'));
        });

        it('should raise const name error', function () {
            const code = contractWith('uint private constant a;');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('SNAKE_CASE'));
        });

        it('should raise modifier name error', function () {
            const code = contractWith('modifier owned_by(address a) { }');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('mixedCase'));
        });

        it('should not raise modifier name error', function () {
            const code = contractWith('modifier ownedBy(address a) { }');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 0);
        });

        it('should raise struct name error', function () {
            const code = contractWith('struct a {}');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('CamelCase'));
        });

        it('should raise contract name error', function () {
            const code = ('contract a {}');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('CamelCase'));
        });

        it('should raise forbidden name error', function () {
            const code = funcWith('uint l = 0;');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Avoid to use'));
        });

        it('should raise enum name error', function () {
            const code = contractWith('enum abc {}');

            const report = linter.processStr(code, noIndent());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('CamelCase'));
        });

    });

});