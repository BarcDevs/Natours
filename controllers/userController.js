const multer = require('multer')
const sharp = require('sharp')
const { catchAsync } = require('./errorController')
const AppError = require('../utils/AppError')
const {
  routes,
  userAllowedFields: allowedFields
} = require('../config')
const factory = require('./handlerFactory')
const User = require('../db/userModel')
const { returnSuccess } = require('../utils/responses')

const multerStorage = multer.memoryStorage()
// multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users')
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1]
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`)
//   }
// })

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image'))
    cb(new AppError(400, 'Not an image! please upload images only.'), false)
  else
    cb(null, true)
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.updateUserImage = upload.single('picture')

exports.resizeUserImage = (req, res, next) => {
  if (!req.file) return next()

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({quality: 90})
    .toFile(`public/img/users/${req.file.filename}`)

  next()
}

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
    ...filterUser(req.body, allowedFields),
    picture: req.file?.filename || undefined
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
  const { reviews } = await User
    .findById(req.user._id)
    .populate({
      path: 'reviews',
      select: '-__v'
    })

  returnSuccess(res, reviews)
})

exports.deleteUser = factory.deleteOne(User)
