/**
 * @fileoverview JSON Style formatter
 * @author ArturLukianov <Original Idea and base source code> <https://github.com/ArturLukianov>
 * @collaborator Diego Bale
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

// eslint-disable-next-line func-names
module.exports = function (results) {
  let allMessages = []

  results.forEach((result) => {
    const messages = result.messages

    messages.forEach((message) => {
      const fullObject = { ...message, filePath: result.filePath }
      fullObject.severity = getMessageType(fullObject)
      allMessages.push(fullObject)
    })
  })

  return JSON.parse(JSON.stringify(allMessages))
}
