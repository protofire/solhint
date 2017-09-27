const assert = require('assert');
const linter = require('./../lib/index');
const { funcWith, contractWith, multiLine } = require('./contract-builder');


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

            const report = linter.processStr(code, {rules: { indent:['error', 'tabs'] } });

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('indent'));
        });

        it('should raise error when line indent is incorrect', function () {
            const code = '\t\timport "lib.sol";';

            const report = linter.processStr(code, {rules: { indent:['error', 'tabs'] } });

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('indent'));
        });

        it('should raise error when line indent is incorrect', function () {
            const code = multiLine(
                '    contract A {        ',
                '        uint private a; ',
                '    }                   '
            );

            const report = linter.processStr(code);

            assert.equal(report.errorCount, 3);
            assert.ok(report.messages[0].message.includes('0'));
            assert.ok(report.messages[1].message.includes('4'));
            assert.ok(report.messages[2].message.includes('0'));
        });

        it('should raise error when line indent is incorrect for function', function () {
            const code = multiLine(
                '    contract A {                  ',
                '        uint private a;           ',
                '        function A() private {    ',
                '      }                           ',
                '    }                             '
            );

            const report = linter.processStr(code, {rules: {'separate-by-one-line-in-contract': false}});

            assert.equal(report.errorCount, 5);
            assert.ok(report.messages[0].message.includes('Expected indentation of 0'));
            assert.ok(report.messages[1].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[2].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[3].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[4].message.includes('Expected indentation of 0'));
        });

        it('should raise error when line indent is incorrect for function with for loop', function () {
            const code = multiLine('                     ', // 1
                '    contract A {                        ', // 2
                '        uint private a;                 ', // 3
                '        function A() private {          ', // 4
                '    for (uint a; a < b; a += 1)         ', // 5
                '            break;                      ', // 6
                '      }                                 ', // 7
                '    }                                   '  // 8
            );

            const report = linter.processStr(code, {rules: {'separate-by-one-line-in-contract': false}});

            assert.equal(report.errorCount, 6);
            assert.ok(report.messages[0].message.includes('Expected indentation of 0'));
            assert.ok(report.messages[1].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[2].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[3].message.includes('Expected indentation of 8'));
            assert.ok(report.messages[4].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[5].message.includes('Expected indentation of 0 spaces'));
        });

        it('should raise error when line indent is incorrect for function with for while loop', function () {
            const code = multiLine('                   ', // 1
                '    contract A {                      ', // 2
                '        uint private a;               ', // 3
                '        function A() private {        ', // 4
                '    while (a < b)                     ', // 5
                '            return;                   ', // 6
                '      }                               ', // 7
                '    }                                 '  // 8
            );

            const report = linter.processStr(code, {rules: {'separate-by-one-line-in-contract': false}});

            assert.equal(report.errorCount, 6);
            assert.ok(report.messages[0].message.includes('Expected indentation of 0 spaces'));
            assert.ok(report.messages[1].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[2].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[3].message.includes('Expected indentation of 8'));
            assert.ok(report.messages[4].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[5].message.includes('Expected indentation of 0'));
        });

        it('should raise error when line indent is incorrect for function with for if statement', function () {
            const code = multiLine('                  ', // 1
                '    contract A {                     ', // 2
                '        uint private a;              ', // 3
                '        function A() private {       ', // 4
                '    if (a < b) {                     ', // 5
                '            a += 1;                  ', // 6
                '        b -= 1;                      ', // 7
                '            continue;                ', // 8
                '        }                            ', // 9
                '      }                              ', // 10
                '    }                                '  // 11
            );

            const report = linter.processStr(code, {rules: {'separate-by-one-line-in-contract': false}});

            assert.equal(report.errorCount, 7);
            assert.ok(report.messages[0].message.includes('Expected indentation of 0 spaces'));
            assert.ok(report.messages[1].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[2].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[3].message.includes('Expected indentation of 8'));
            assert.ok(report.messages[4].message.includes('Expected indentation of 12'));
            assert.ok(report.messages[5].message.includes('Expected indentation of 4'));
            assert.ok(report.messages[6].message.includes('Expected indentation of 0'));
        });

        it('should not raise error when line indent is correct for function with for if-else statement', function () {
            const code = multiLine('              ', // 1
                'contract A {                     ', // 2
                '    function A() private {       ', // 3
                '        if (a < b) {             ', // 4
                '            a += 1;              ', // 5
                '        } else {                 ', // 6
                '            b -= 1;              ', // 7
                '        }                        ', // 8
                '    }                            ', // 9
                '}                                '  // 10
            );

            const report = linter.processStr(code, {rules: {'separate-by-one-line-in-contract': false}});

            assert.equal(report.errorCount, 0);
        });

        it('should raise error when line indent is not correct for function with for assembly statement', function () {
            const code = multiLine('              ', // 1
                'contract A {                     ', // 2
                '    function A() private {       ', // 3
                '        assembly {               ', // 4
                '         {}                      ', // 5
                '        }                        ', // 6
                '    }                            ', // 7
                '}                                '  // 8
            );

            const report = linter.processStr(code, {rules: {'separate-by-one-line-in-contract': false}});

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Indentation is incorrect'));
        });

        it('should not raise error when line indent is correct for function with for if-else statement', function () {
            const code = multiLine('               ', // 1
                'contract A {                      ', // 2
                '    function A() private {        ', // 3
                '        if (                      ', // 4
                '            a < b                 ', // 5
                '        ) {                       ', // 6
                '            a += 1;               ', // 7
                '        } else {                  ', // 8
                '            b -= 1;               ', // 9
                '        }                         ', // 10
                '    }                             ', // 11
                '}                                 '  // 12
            );

            const report = linter.processStr(code, {rules: {'separate-by-one-line-in-contract': false}});

            assert.equal(report.errorCount, 0);
        });

        it('should not raise error for custom configured indent rules', function () {
            const code = multiLine('',
                'contract A {              ',
                '\tuint private a = 0;     ',
                '\tfunction A() {          ',
                '\t\t\tuint a = 5;         ',
                '\t}                       ',
                '}                         '
            );

            const report = linter.processStr(code, {
                rules: {
                    indent: ['warn', 'tabs'],
                    'func-visibility': false,
                    'separate-by-one-line-in-contract': false
                }
            });

            assert.equal(report.warningCount, 1);
            assert.ok(report.messages[0].message.includes('Expected indentation of 2 tabs'));
        });

        it('should raise error when bracket incorrect aligned', function () {
            const code = funcWith(`
                for (uint i = 0; i < a; i += 1) 
                {
                  continue;
                }
            `);

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Open bracket'));
        });

        it('should raise error when array declaration has spaces', function () {
            const code = contractWith('uint [] [] private a;');

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 2);
            assert.ok(report.messages[0].message.includes('Array declaration'));
            assert.ok(report.messages[0].message.includes('Array declaration'));
        });

        it('should not raise error for array declaration', function () {
            const code = contractWith('uint[][] private a;');

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 0);
        });

        it('should raise error when items inside contract do not separated by new line', function () {
            const code = contractWith(`
                function a() public {
                }
                function b() public {}
            `);

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('must be separated by one line'));
        });

        it('should not raise error when items inside contract separated by new line', function () {
            const code = contractWith(`
                function a() public {
                }
                
                // any comment
                function b() public {}
            `);

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 0);
        });

        it('should not raise error when items inside contract separated by new line with comments', function () {
            const code = contractWith(`
                function a() public {
                }
                
                /**
                 * Function b
                 */
                function b() public {}
            `);

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 0);
        });

        it('should raise error when line length exceed 120', function () {
            const code = ' '.repeat(121);

            const report = linter.processStr(code, config());

            assert.equal(report.errorCount, 1);
            assert.ok(report.messages[0].message.includes('Line length must be no more than'));
        });

        it('should not raise error when line length exceed 120 and custom config provided', function () {
            const code = ' '.repeat(130);

            const report = linter.processStr(code, {
                rules: { indent: false, 'max-line-length': ['error', 130] }
            });

            assert.equal(report.errorCount, 0);
        });

    });

    function config() {
        return {
            rules: { indent: false }
        };
    }
});