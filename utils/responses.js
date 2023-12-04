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
