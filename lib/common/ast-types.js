const fallbackVisibility = ['external', 'public']

function isFallbackFunction(node) {
  return node.name === '' && fallbackVisibility.includes(node.visibility)
}

function isFunctionDefinition(node) {
  return node.type === 'FunctionDefinition'
}

module.exports = {
  isFallbackFunction,
  isFunctionDefinition
}
