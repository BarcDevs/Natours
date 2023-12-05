const AppError = require('./AppError')

exports.returnSuccess = (res, data = {}, statusCode = 200, additionalFields = {}) => {
  res
    .status(statusCode)
    .json({
      status: 'success',
      ...additionalFields,
      data
    })
}

exports.returnError = (res, err, status, statusCode) => {
  res
    .status(statusCode)
    .json({
      status,
      message: err.message,
      error: err
    })
}

exports.returnNotFound = (next, id) => next(
  new AppError(404, `No document found for ID ${id}`)
)
