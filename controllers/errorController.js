const AppError = require('../utils/AppError')

exports.notFound = (req, res, next) => {
  next(new AppError(404, `Unable to find ${req.originalUrl}`))
}

exports.catchAsync = fn => async (req, res, next) => {
  try {
    return await fn(req, res, next)
  } catch (err) {
    next(new AppError(400, err))
  }
}

const sendErrorInProd = (err, res) => {
  if (err.operationalError) {
    res
      .status(err.statusCode)
      .json({
        status: err.status,
        message: err.message
      })
  } else {
    console.error(`Error: ${err}`)

    res
      .status(500)
      .json({
        status: 'error',
        message: 'Oops! Something went wrong'
      })
  }
}

const sendErrorInDev = (err, res) => {
  res
    .status(err.statusCode)
    .json({
      status: err.status,
      code: err.statusCode,
      message: err.message,
      error: {
        ...err,
        stackTrace: err.stack
      }
    })
}

exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  err.message = err.message || 'An error has occur'

  if (process.env.NODE_ENV === 'development') {
    sendErrorInDev(err, res)
  } else {
    sendErrorInProd(err, res)
  }
}
