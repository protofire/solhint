const assert = require('assert');
const linter = require('./../lib/index');


describe('Linter', function() {
    describe('Comment Directives', function () {

        it('should disable fixed compiler error', function () {
            const report = linter.processStr('pragma solidity ^0.4.4; // solhint-disable-line');

            assert.equal(report.errorCount, 0);
        });

        it('should disable fixed compiler error using multiline comment', function () {
            const report = linter.processStr('pragma solidity ^0.4.4; /* solhint-disable-line */');

            assert.equal(report.errorCount, 0);
        });

        it('should disable only one compiler error', function () {
            const report = linter.processStr(`
                // solhint-disable-next-line
                pragma solidity ^0.4.4; 
                pragma solidity 0.3.4;
            `);

            assert.equal(report.errorCount, 1);
        });

        it('should disable only one compiler error using multiline comment', function () {
            const report = linter.processStr(`
                /* solhint-disable-next-line */
                pragma solidity ^0.4.4; 
                pragma solidity 0.3.4;
            `);

            assert.equal(report.errorCount, 1);
        });

        it('should disable only compiler version error', function () {
            const report = linter.processStr(`
                // solhint-disable compiler-gt-0_4
                pragma solidity ^0.4.4; 
                pragma solidity 0.3.4; // disabled error: Compiler version must be greater that 0.4
            `);

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('Compiler version must be fixed'));
        });


        it('should disable only one compiler version error', function () {
            const report = linter.processStr(`
                /* solhint-disable compiler-gt-0_4 */
                pragma solidity 0.3.4;
                /* solhint-enable compiler-gt-0_4 */
                pragma solidity 0.3.4; 
            `);

            assert.equal(report.errorCount, 1);
            assert.ok(report.reports[0].message.includes('0.4'));
        });

        it('should not disable fixed compiler error', function () {
            const report = linter.processStr(`
                /* solhint-disable compiler-gt-0_4 */
                pragma solidity ^0.4.4;
                /* solhint-enable compiler-gt-0_4 */
                pragma solidity ^0.4.4; 
            `);

            assert.equal(report.errorCount, 2);
            assert.ok(report.reports[0].message.includes('fixed'));
        });

        it('should disable all errors', function () {
            const report = linter.processStr(`
                /* solhint-disable */
                pragma solidity ^0.4.4;
                pragma solidity 0.3.4; 
            `);

            assert.equal(report.errorCount, 0);
        });

    });
});