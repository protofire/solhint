module.exports = {
  getLocFromIndex(text, index) {
    let line = 1
    let column = 0
    let i = 0
    while (i < index) {
      if (text[i] === '\n') {
        line++
        column = 0
      } else {
        column++
      }
      i++
    }

    return { line, column }
  }
}
