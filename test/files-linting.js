const linter = require('./../lib/index');
const assert = require('assert');
const { assertNoErrors, assertErrorCount } = require('./common/asserts');
const { contractWith } = require('./common/contract-builder');
const { noIndent } = require('./common/configs');
const os = require('os');
const fs = require('fs');


describe('Linter', function () {

    describe('File Linting', function () {

        it('should raise no error', function () {
            const filePath = storeAsFile(contractWith('string private a = "test";'));

            const report = linter.processFile(filePath, noIndent());

            assertNoErrors(report);
            assert.equal(report.filePath, filePath);
        });

        it('should raise an one error', function () {
            const filePath = storeAsFile(contractWith('string private a = \'test\';'));

            const reports = linter.processPath(filePath, noIndent());

            assertErrorCount(reports[0], 1);
        });

        after(function () {
            removeTmpFiles();
        });

    });


    function tmpFilePath() {
        const tempDirPath = os.tmpdir();
        return `${tempDirPath}/test.sol`;
    }

    function storeAsFile(code) {
        const filePath = tmpFilePath();

        fs.writeFileSync(filePath, code, 'utf-8');

        return filePath;
    }

    function removeTmpFiles() {
        try {
            fs.unlinkSync(tmpFilePath());
        } catch (err) {
            // console.log(err);
        }
    }

});