const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('Indent Rules', function () {

        it('should raise error when contract do not surrounds with two blank lines', function () {
            const code = `
            contract A {}
            
            contract B {}
            `;

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 2);
            assert.ok(report.messages[0].message.includes('two blank'));
        });

        it('should not raise error when contract do not surrounds with two blank lines', function () {
            const code = `
            contract A {}
            
            
            contract B {}
            
            
            contract C {}
            `;

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 0);
        });

        it('should raise error about mixed tabs and spaces', function () {
            const code = ' \t import "lib.sol";';

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Mixed tabs and spaces'));
        });

        it('should raise error when line indent is incorrect', function () {
            const code = '\t\timport "lib.sol";';

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('indent'));
        });

        it('should raise error when line indent is incorrect', function () {
            const code = '\t\timport "lib.sol";';

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('indent'));
        });

        it('should raise error when line indent is incorrect', function () {
            const code = '\n'
                + '    contract A {\n'
                + '        uint private a;\n'
                + '    }\n';

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 3);
            assert.ok(report.messages[0].message.includes('0'));
            assert.ok(report.messages[1].message.includes('4'));
            assert.ok(report.messages[2].message.includes('0'));
        });

        it('should raise error when line indent is incorrect for function', function () {
            const code = '\n'
                + '    contract A {\n'
                + '        uint private a;\n'
                + '        function A() private { \n'
                + '      }\n'
                + '    }\n';

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 5);
            assert.ok(report.messages[0].message.includes('Expected indentation of 0'));
            assert.ok(report.messages[1].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[2].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[3].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[4].message.includes('Expected indentation of 0'));
        });

    });

    function config() {
        return {
            rules: { indent: false }
        };
    }
});