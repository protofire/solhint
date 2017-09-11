
class Reporter {
    constructor (tokenStream) {
        this.reports = [];
        this.tokenStream = tokenStream;
    }

    addReport(line, column, severity, message) {
        this.reports.push({ line, column, severity, message });
    }

    addMessage(interval, severity, message) {
        let line = this.tokenStream.get(interval.start).line;
        let charAtLine = this.tokenStream.get(interval.start).column;

        this.addReport(line, charAtLine, severity, message);
    }

    get errorCount() {
        return this
            .reports
            .filter(i => i.severity === Reporter.SEVERITY.ERROR)
            .length;
    }

    get warningCount() {
        return this
            .reports
            .filter(i => i.severity === Reporter.SEVERITY.WARN)
            .length;
    }

    get messages() {
        return this.reports;
    }

    get filePath() {
        return this.file;
    }
}

Reporter.SEVERITY = Object.freeze({ ERROR: 2, WARN: 3 });


module.exports = Reporter;