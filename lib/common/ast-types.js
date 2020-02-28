function isFallbackFunction(node) {
  return isFunctionDefinition(node) && node.isFallback
}

function isFunctionDefinition(node) {
  return node.type === 'FunctionDefinition'
}

module.exports = {
  isFallbackFunction,
  isFunctionDefinition
}
