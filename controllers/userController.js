const { catchAsync } = require('./errorController')
const AppError = require('../utils/AppError')
const {
  routes,
  userAllowedFields: allowedFields
} = require('../config')
const factory = require('./handlerFactory')
const User = require('../db/userModel')
const { returnSuccess } = require('../utils/responses')

const filterUser = (userObj, fields) => Object.fromEntries(
  Object.entries(userObj)
    .filter(([key]) => fields.includes(key))
)

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id
  next()
}

exports.updateUserData = catchAsync(async (req, res, next) => {
  const {
    password,
    passwordConfirm
  } = req.body

  if (password || passwordConfirm) {
    return next(new AppError(400, `This is not the route for changing password. please use ${routes.userRoutes.updatePassword}.`))
  }

  const user = await User.findByIdAndUpdate(req.user?._id, {
    ...filterUser(req.body, allowedFields)
  }, {
    new: true,
    runValidators: true
  })

  returnSuccess(res, { user })
})

exports.deactivateUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user?._id, {
    active: false
  })

  returnSuccess(res, {}, 204)
})

exports.getUsers = factory.getMany(User)

exports.getUserById = factory.getById(User)

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const {reviews} = await User
    .findById(req.user._id)
    .populate({
      path: 'reviews',
      select: '-__v'
    })

  returnSuccess(res, reviews)
})

exports.deleteUser = factory.deleteOne(User)
