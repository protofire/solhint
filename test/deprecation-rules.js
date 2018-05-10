const assert = require('assert');
const linter = require('./../lib/index');
const { multiLine } = require('./common/contract-builder');
const { assertErrorMessage } = require('./common/asserts');
const BaseDeprecation = require('./../lib/rules/deprecations/base-deprecation');

describe('Linter - Deprecations', function () {

    const config = {rules: {
        'separate-by-one-line-in-contract': false, 'bracket-align': false,
        'no-empty-blocks': false, 'no-inline-assembly': false,
        'two-lines-top-level-separator': false
    }};

    describe('Constructor Syntax', function () {
        it('should raise a warning for old-style constructors', function () {
            const code = multiLine('              ', // 1
                'pragma solidity 0.4.22;          ', // 2
                'contract A {                     ', // 3
                '    function A() public {}       ', // 4
                '}                                '  // 5
            );
            const report = linter.processStr(code, config);
            assert.equal(report.warningCount, 1);
            assertErrorMessage(report, 0, 'constructor keyword');
        });
        it('should NOT raise a warning for old-style constructors in old versions', function () {
            const code = multiLine('              ', // 1
                'pragma solidity 0.4.21;          ', // 2
                'contract A {                     ', // 3
                '    function A() public {}       ', // 4
                '}                                '  // 5
            );
            const report = linter.processStr(code, config);
            assert.equal(report.warningCount, 0);
        });
        it('should NOT raise a warning for new-style constructors', function () {
            const code = multiLine('              ', // 1
                'pragma solidity 0.4.22;          ', // 2
                'contract A {                     ', // 3
                '    constructor() public {}      ', // 4
                '}                                '  // 5
            );
            const report = linter.processStr(code, config);
            assert.equal(report.warningCount, 0);
        });
        it('should raise an error for new-style constructors in old versions', function () {
            const code = multiLine('              ', // 1
                'pragma solidity 0.4.21;          ', // 2
                'contract A {                     ', // 3
                '    constructor() public {}      ', // 4
                '}                                '  // 5
            );
            const report = linter.processStr(code, config);
            assert.equal(report.errorCount, 1);
            assertErrorMessage(report, 0, 'Constructor keyword');
        });
    });

    describe('General infrastructure', function () {
        it('should fail without deprecationVersion() implemented', function () {
            assert.throws(()=>new BaseDeprecation());
        });
    });
});
