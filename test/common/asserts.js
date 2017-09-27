const assert = require('assert');


function assertErrorMessage(...args) {
    const report = args[0];
    let index;
    let message;

    if (args.length === 3) {
        index = args[1];
        message = args[2];
    } else {
        index = 0;
        message = args[1];
    }

    const errorMessage = `Report should contain message with text "${message}" on ${index} position`;
    assert.ok(report.messages[index].message.includes(message), errorMessage);
}


function assertNoErrors(report) {
    assert.equal(report.errorCount, 0, 'Report must not contain errors');
}


function assertNoWarnings(report) {
    assert.equal(report.warningCount, 0, 'Report must not contain warnings');
}


function assertErrorCount(report, count) {
    assert.equal(report.errorCount, count, `Report must contains ${count} errors`);
}


function assertWarnsCount(report, count) {
    assert.equal(report.warningCount, count, `Report must contains ${count} warnings`);
}


module.exports = { assertErrorMessage, assertNoWarnings, assertNoErrors, assertErrorCount, assertWarnsCount };