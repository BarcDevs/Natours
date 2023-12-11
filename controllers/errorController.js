const AppError = require('../utils/AppError')

exports.notFound = (req, res, next) => {
  next(new AppError(404, `Unable to find ${req.originalUrl}`))
}

const renderError = (res, statusCode, message) => res.status(statusCode)
  .render('error', {
    title: 'Something went wrong',
    message
  })

exports.catchAsync = fn => async (req, res, next) => {
  try {
    return await fn(req, res, next)
  } catch (err) {
    next(new AppError(400, err))
  }
}

const sendErrorInProd = (err, req, res) => {
  const isApi = req.originalUrl.startsWith('/api')
  const {
    status,
    statusCode,
    message
  } = err

  if (err.operationalError) {
    return isApi ? res
        .status(statusCode)
        .json({
          status,
          message
        })
      : renderError(res, statusCode, message)
  }
  console.error(`Error: ${err}`)

  return isApi ? res
      .status(500)
      .json({
        status: 'error',
        message: 'Oops! Something went wrong'
      })
    : renderError(res, 500, 'An unknown error happen. please try again later or contact with support')
}

const sendErrorInDev = (err, req, res) => {
  const {
    status,
    statusCode,
    message,
    stack
  } = err

  if (req.originalUrl.startsWith('/api')) {
    return res
      .status(err.statusCode)
      .json({
        status,
        code: statusCode,
        message,
        error: {
          ...err,
          stackTrace: stack
        }
      })
  }

  return renderError(res, statusCode, message)
}

exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  err.message = err.message || 'An error has occur'

  if (process.env.NODE_ENV === 'development') {
    sendErrorInDev(err, req, res)
  } else {
    sendErrorInProd(err, req, res)
  }
}
