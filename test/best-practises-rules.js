const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('./common/asserts');
const { noIndent } = require('./common/configs');
const linter = require('./../lib/index');
const { contractWith, funcWith } = require('./common/contract-builder');


describe('Linter', function() {
    describe('Best Practises Rules', function () {

        it('should raise warn when fallback is not payable', function () {
            const code = contractWith('function () public {}');

            const report = linter.processStr(code, noIndent());

            assertWarnsCount(report, 1);
            assertErrorMessage(report, 'payable');
        });

        it('should not raise warn when fallback is payable', function () {
            const code = contractWith('function () public payable {}');

            const report = linter.processStr(code, noIndent());

            assertNoWarnings(report);
        });

        const EMPTY_BLOCKS = [
            contractWith('function () public payable {}'),
            funcWith('if (a < b) {  }'),
            contractWith('struct Abc {  }'),
            contractWith('enum Abc {  }'),
            'contract A { }',
            funcWith('assembly {  }')
        ];

        EMPTY_BLOCKS.forEach(curData =>
            it(`should raise warn for empty blocks ${label(curData)}`, function () {
                const report = linter.processStr(curData, {rules: {indent: false}});

                assertWarnsCount(report, 1);
                assertErrorMessage(report, 'empty block');
            }));

        const BLOCKS_WITH_DEFINITIONS = [
            contractWith('function () public payable { make1(); }'),
            funcWith('if (a < b) { make1(); }'),
            contractWith('struct Abc { uint a; }'),
            contractWith('enum Abc { Test1 }'),
            'contract A { uint private a; }',
            funcWith('assembly { "literal" }')
        ];

        BLOCKS_WITH_DEFINITIONS.forEach(curData =>
            it(`should not raise warn for blocks ${label(curData)}`, function () {
                const report = linter.processStr(curData, {rules: {indent: false}});

                assertNoWarnings(report);
            }));

        const UNUSED_VARS = [
            contractWith('function a(uint a, uint b) public { b += 1; }'),
            funcWith('uint a = 0;'),
            funcWith('var (a) = 1;'),
            contractWith('function a(uint a, uint b) public { uint c = a + b; }')
        ];

        UNUSED_VARS.forEach(curData =>
            it(`should raise warn for vars ${label(curData)}`, function () {
                const report = linter.processStr(curData, {rules: {indent: false}});

                assertWarnsCount(report, 1);
                assertErrorMessage(report, 'unused');
            }));

        const USED_VARS = [
            contractWith('function a(uint a) public { uint b = bytes32(a); b += 1; }'),
            contractWith('function a() public returns (uint c) { return 1; }'),
            contractWith('function a(uint d) public returns (uint c) { }'),
            contractWith('function a(uint a, uint c) public returns (uint c);')
        ];

        USED_VARS.forEach(curData =>
            it(`should not raise warn for vars ${label(curData)}`, function () {
                const report = linter.processStr(curData, {rules: {indent: false, 'no-empty-blocks': false}});

                assertNoWarnings(report);
            }));

    });

    function label (data) {
        return data.split('\n')[0];
    }
});