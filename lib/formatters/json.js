/**
 * @fileoverview unix-style formatter.
 * @author oshi-shinobu
 */

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns a canonical error level string based upon the error message passed in.
 * @param {Object} message Individual error message provided by eslint
 * @returns {string} Error level string
 */
function getMessageType(message) {
  if (message.fatal || message.severity === 2) {
    return 'Error'
  }
  return 'Warning'
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function (results) {   // eslint-disable-line
  let allMessages = []

  results.forEach((result) => {
    const messages = result.messages
    allMessages.push(...messages)
  })

  return JSON.stringify(allMessages)
}
