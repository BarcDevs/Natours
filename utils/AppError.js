class AppError extends Error {
  constructor(statusCode, error) {
    super(error?.message || error)

    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error'
    this.operationalError = true

    Error.captureStackTrace(this, this.constructor)

    if (typeof error === 'object') {
      this.handleObjectError(error)
    }
  }

  handleObjectError(error) {
    this.data = error

    switch (error.name) {
      // MongoDB errors
      case 'CastError':
        this.message = `Invalid value ${error.value} for field ${error.path}`
        break
      case 'ValidationError':
        this.message = `Invalid input:${Object.values(error.errors)
          .map(e => ` ${e.message}`)}`
        break
      case 'MongoServerError':
        this.handleMongoError(error)
        break

      // JWT errors
      case 'JsonWebTokenError':
        this.message = 'Invalid token. please log in again!'
        this.statusCode = 401
        break
      case 'TokenExpiredError':
        this.message = 'Token has expired. please log in again!'
        this.statusCode = 401
        break

      default:
        break
    }
  }

  handleMongoError(error) {
    const { keyValue } = error

    switch (error.code) {
      case 11000:
        this.message = `${Object.keys(keyValue)
          .map(key => `${key}: "${keyValue[key]}" is already exist!`)}`
        break
      default:
        break
    }
  }
}

module.exports = AppError
