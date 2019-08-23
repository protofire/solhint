const { validSeverityMap } = require('../config/config-validator')

const formatEnum = options => options.map(op => JSON.stringify(op)).join(', ')

module.exports = {
  severityDescription: `Rule severity. Must be one of ${formatEnum(validSeverityMap)}.`,
  formatEnum
}
