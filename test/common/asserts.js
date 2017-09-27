const assert = require('assert');


function assertThatReportHas(report, index, message) {
    assert.ok(report.messages[index].message.includes(message));
}


function assertNoErrors(report) {
    assert.equal(report.errorCount, 0);
}


function assertNoWarnings(report) {
    assert.equal(report.warningCount, 0);
}


function assertErrorCount(report, count) {
    assert.equal(report.errorCount, count);
}


function assertWarnsCount(report, count) {
    assert.equal(report.warningCount, count);
}


module.exports = { assertThatReportHas, assertNoWarnings, assertNoErrors, assertErrorCount, assertWarnsCount };