class Reporter {
  constructor(tokenStream, config) {
    this.reports = []
    this.config = config.rules || {}
  }

  addReport(line, column, severity, message, ruleId) {
    this.reports.push({ line, column, severity, message, ruleId })
  }

  addMessage(loc, defaultSeverity, message, ruleId) {
    this.addMessageExplicitLine(loc.start.line, loc.start.column, defaultSeverity, message, ruleId)
  }

  addMessageExplicitLine(line, column, defaultSeverity, message, ruleId) {
    const configSeverity = this.severityOf(ruleId)

    if (this.config[ruleId] !== false) {
      this.addReport(line, column + 1, configSeverity || defaultSeverity, message, ruleId)
    }
  }

  error(ctx, ruleId, message) {
    this.addMessage(ctx.loc, Reporter.SEVERITY.ERROR, message, ruleId)
  }

  warn(ctx, ruleId, message) {
    this.addMessage(ctx.loc, Reporter.SEVERITY.WARN, message, ruleId)
  }

  errorAt(line, column, ruleId, message) {
    this.addMessageExplicitLine(line, column, Reporter.SEVERITY.ERROR, message, ruleId)
  }

  severityOf(ruleId) {
    const ruleConfig = this.config[ruleId]
    let curSeverity

    if (ruleConfig && ruleConfig instanceof Array) {
      curSeverity = ruleConfig[0]
    } else if (ruleConfig) {
      curSeverity = ruleConfig
    } else {
      return null
    }

    return Reporter.SEVERITY[curSeverity.toUpperCase()]
  }

  get errorCount() {
    return this._countReportsWith(Reporter.SEVERITY.ERROR)
  }

  get warningCount() {
    return this._countReportsWith(Reporter.SEVERITY.WARN)
  }

  _countReportsWith(severity) {
    return this.reports.filter(i => i.severity === severity).length
  }

  get messages() {
    return this.reports.sort((x1, x2) => x1.line - x2.line)
  }

  get filePath() {
    return this.file
  }
}

Reporter.SEVERITY = Object.freeze({ ERROR: 2, WARN: 3 })

module.exports = Reporter
