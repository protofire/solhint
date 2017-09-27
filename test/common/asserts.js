const assert = require('assert');


function assertThatReportHas(report, index, message) {
    assert.ok(report.messages[index].message.includes(message));
}


function assertNoErrors(report) {
    assert.equal(report.errorCount, 0);
}


function assertNoWarnings(report) {
    assert.equal(report.errorCount, 0);
}


module.exports = { assertThatReportHas, assertNoWarnings, assertNoErrors };