const { noIndent } = require('./common/configs');
const { assertNoErrors, assertErrorCount, assertWarnsCount, assertErrorMessage } = require('./common/asserts');
const linter = require('./../lib/index');


describe('Linter', function () {
    describe('Comment Directives', function () {

        it('should disable fixed compiler error', function () {
            const report = linter.processStr('pragma solidity ^0.4.4; // solhint-disable-line');

            assertNoErrors(report);
        });

        it('should disable fixed compiler error using multiline comment', function () {
            const report = linter.processStr('pragma solidity ^0.4.4; /* solhint-disable-line */');

            assertNoErrors(report);
        });

        it('should disable only one compiler error', function () {
            const report = linter.processStr(`
                // solhint-disable-next-line
                pragma solidity ^0.4.4; 
                pragma solidity 0.3.4;
            `, noIndent());

            assertErrorCount(report, 1);
        });

        it('should disable only one compiler error using multiline comment', function () {
            const report = linter.processStr(`
                /* solhint-disable-next-line */
                pragma solidity ^0.4.4; 
                pragma solidity 0.3.4;
            `, noIndent());

            assertErrorCount(report, 1);
        });

        it('should disable only compiler version error', function () {
            const report = linter.processStr(`
                // solhint-disable compiler-gt-0_4
                pragma solidity ^0.4.4; 
                pragma solidity 0.3.4; // disabled error: Compiler version must be greater that 0.4
            `, noIndent());

            assertWarnsCount(report, 1);
            assertErrorMessage(report, 'Compiler version must be fixed');
        });


        it('should disable only one compiler version error', function () {
            const report = linter.processStr(`
                /* solhint-disable compiler-gt-0_4 */
                pragma solidity 0.3.4;
                /* solhint-enable compiler-gt-0_4 */
                pragma solidity 0.3.4; 
            `, noIndent());

            assertErrorCount(report, 1);
            assertErrorMessage(report, '0.4');
        });

        it('should not disable fixed compiler error', function () {
            const report = linter.processStr(`
                /* solhint-disable compiler-gt-0_4 */
                pragma solidity ^0.4.4;
                /* solhint-enable compiler-gt-0_4 */
                pragma solidity ^0.4.4; 
            `, noIndent());

            assertWarnsCount(report, 2);
            assertErrorMessage(report, 'fixed');
        });

        it('should disable all errors', function () {
            const report = linter.processStr(`
                /* solhint-disable */
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4; 
            `, noIndent());

            assertNoErrors(report);
        });

        it('should disable then enable all errors', function () {
            const report = linter.processStr(`
                /* solhint-disable */
                pragma solidity ^0.4.4;
                /* solhint-enable */
                pragma solidity ^0.4.4; 
            `, noIndent());

            assertWarnsCount(report, 1);
            assertErrorMessage(report, 'fixed');
        });

        it('should not erase error', function () {
            const report = linter.processStr('/* solhint-disable-next-line */');

            assertNoErrors(report);
        });

    });
});