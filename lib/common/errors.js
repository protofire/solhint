class FileNotExistsError extends Error {
  constructor(data) {
    const { message } = data
    super(message)
  }
}

module.exports = {
  FileNotExistsError
}
