const { assertNoWarnings, assertErrorMessage, assertWarnsCount } = require('./common/asserts');
const { assertErrorCount, assertNoErrors } = require('./common/asserts');
const { noIndent } = require('./common/configs');
const linter = require('./../lib/index');
const { contractWith, funcWith } = require('./common/contract-builder');
const _ = require('lodash');


describe('Linter - Best Practises Rules', function () {


    describe('Fallback must be payable', function () {

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

    });


    describe('No empty blocks', function () {

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
                const report = linter.processStr(curData, config());

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
                const report = linter.processStr(curData, config());

                assertNoWarnings(report);
            }));

        function config() {
            return {rules: {indent: false, 'no-inline-assembly': false}};
        }

    });


    describe('No unused vars', function () {

        const UNUSED_VARS = [
            contractWith('function a(uint a, uint b) public { b += 1; }'),
            funcWith('uint a = 0;'),
            funcWith('var (a) = 1;'),
            contractWith('function a(uint a, uint b) public { uint c = a + b; }')
        ];

        UNUSED_VARS.forEach(curData =>
            it(`should raise warn for vars ${label(curData)}`, function () {
                const report = linter.processStr(curData, noIndent());

                assertWarnsCount(report, 1);
                assertErrorMessage(report, 'unused');
            }));

        const USED_VARS = [
            contractWith('function a(uint a) public { uint b = bytes32(a); b += 1; }'),
            contractWith('function a() public returns (uint c) { return 1; }'),
            contractWith('function a(uint d) public returns (uint c) { }'),
            contractWith('function a(uint a, uint c) public returns (uint c);'),
            contractWith('function a(address a) internal { assembly { t := eq(a, and(mask, calldataload(4))) } }')
        ];

        USED_VARS.forEach(curData =>
            it(`should not raise warn for vars ${label(curData)}`, function () {
                const config = _.defaultsDeep({rules: {'no-inline-assembly': false}}, noIndent());

                const report = linter.processStr(curData, config);

                assertNoWarnings(report);
            }));

    });


    describe('Max line length', function () {

        it('should raise error for function with 51 lines', function () {
            const code = funcWith(emptyLines(51));

            const report = linter.processStr(code, noIndent());

            assertErrorCount(report, 1);
            assertErrorMessage(report, 'no more than');
        });

        it('should not raise error for function with 50 lines', function () {
            const code = funcWith(emptyLines(50));

            const report = linter.processStr(code, noIndent());

            assertNoErrors(report);
        });

        it('should not raise error for function with 99 lines with 100 allowed', function () {
            const code = funcWith(emptyLines(99));
            const config = _.defaultsDeep(noIndent(), {rules: {'function-max-lines': ['error', 100]}});

            const report = linter.processStr(code, config);

            assertNoErrors(report);
        });

    });


    describe('Max states count', function () {

        it('should raise error when count of states too big', function () {
            const code = contractWith(stateDef(16));

            const report = linter.processStr(code, noIndent());

            assertErrorCount(report, 1);
            assertErrorMessage(report, 'no more than 15');
        });

        it('should not raise error for count of states that lower that max', function () {
            const code = contractWith([stateDef(10), constantDef(10)].join('\n'));

            const report = linter.processStr(code, noIndent());

            assertNoErrors(report);
        });

        it('should not raise error for count of states when it value increased in config', function () {
            const code = contractWith(stateDef(20));
            const config = _.defaultsDeep(noIndent(), {rules: {'max-states-count': ['error', 20]}});

            const report = linter.processStr(code, config);

            assertNoErrors(report);
        });

    });


    function label(data) {
        const items = data.split('\n');
        const lastItemIndex = items.length  - 1;
        const labelIndex = Math.floor(lastItemIndex / 5) * 4;
        return items[labelIndex];
    }

    function repeatLines(line, count) {
        return _.times(count)
            .map(() => line)
            .join('\n');
    }

    function emptyLines(count) {
        return repeatLines('', count);
    }

    function stateDef(count) {
        return repeatLines('uint private a;', count);
    }

    function constantDef(count) {
        return repeatLines('uint private constant TEST = 1;', count);
    }
});