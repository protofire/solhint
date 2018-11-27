class FileNotExistsError extends Error {
  constructor(message, status) {
    super(message)

    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)

    this.status = status || 500
  }
}

module.exports = {
  FileNotExistsError
}
