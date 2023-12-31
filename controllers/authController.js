const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { addDays } = require('date-fns')
const User = require('../db/userModel')
const { catchAsync } = require('./errorController')
const { returnSuccess } = require('../utils/responses')
const AppError = require('../utils/AppError')
const {
  endpoints,
  routes,
  userAllowedFields: allowedFields
} = require('../config')
const Email = require('../utils/email')

const tokenCookieOptions = {
  expires: addDays(Date.now(), process.env.JWT_EXPIRES_IN.slice(0, -1)),
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development'
}

const createToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN
})

const validateLogin = catchAsync(async ({
  email,
  password
}, next) => {
  if (!email || !password) {
    return next(new AppError(400, 'Please provide email and password'))
  }

  const user = await User.findOne({ email })
    .select('+password')

  if (!user || !(await user.matchPasswords(password, user.password))) {
    return next(new AppError(401, 'Email or password are incorrect'))
  }
  return user
})

const filterUser = (userObj, fields) => Object.fromEntries(
  Object.entries(userObj)
    .filter(([key]) => fields.includes(key))
)

const checkPasswordChanged = (JWTTimeStamp, passwordTimeStamp) =>
// eslint-disable-next-line implicit-arrow-linebreak
  (passwordTimeStamp.getTime() / 1000) > JWTTimeStamp

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    ...filterUser(req.body, ['password', 'passwordConfirm', ...allowedFields])
  })
  const token = createToken(newUser._id)

  const profileUrl = `${req.protocol}://${req.get('host')}${routes.viewRoutes.me}`
  try {
      await new Email(newUser, profileUrl).sendWelcome()
  } catch (e) {
      console.log(e.message)
  }
  newUser.password = undefined
  res.cookie('jwt', `Bearer ${token}`, tokenCookieOptions)
  returnSuccess(res, { user: newUser }, 201, { token })
})

exports.login = catchAsync(async (req, res, next) => {
  const user = await validateLogin(req.body, next)
  if (!user) return
  const token = createToken(user._id)

  res.cookie('jwt', `Bearer ${token}`, tokenCookieOptions)
  returnSuccess(res, { user }, 200, { token })
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', tokenCookieOptions)
  returnSuccess(res)
}

exports.protectRoute = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization || req.cookies.jwt

  /* Check if token is valid */
  if (!(token && token.startsWith('Bearer'))) {
    return next(new AppError(401, 'You are not logged in! please log in to get access'))
  }

  /* Validate token */
  const decodedToken = await promisify(jwt.verify)(token.split(' ')[1], process.env.JWT_SECRET)

  /* Check if user is still exist */
  const user = await User.findById(decodedToken.id)
    .select('+passwordLastChangeAt')
  if (!user) {
    return next(new AppError(401, 'User does not exist. please signup or log in with a valid user'))
  }

  /* Check if password has changed */
  if (checkPasswordChanged(decodedToken.iat, user.passwordLastChangeAt)) {
    return next(new AppError(401, 'Password has changed. please log in again!'))
  }

  /* User authenticated */
  res.locals.user = req.user = user
  next()
})

exports.isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt

    /* Check if token is valid */
    if (!(token && token?.startsWith('Bearer'))) return next()

    /* Validate token */
    const decodedToken = await promisify(jwt.verify)(token.split(' ')[1], process.env.JWT_SECRET)

    /* Check if user is still exist */
    const user = await User.findById(decodedToken.id)
      .select('+passwordLastChangeAt')
    if (!user) return next()

    /* Check if password has changed */
    if (checkPasswordChanged(decodedToken.iat, user.passwordLastChangeAt)) return next()

    /* User authenticated */
    res.locals.user = user
    next()
  } catch (err) {
    // eslint-disable-next-line no-unused-expressions
    err.message !== 'invalid token' && console.log(err.message)
    next()
  }
}

exports.restrictRoute = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(new AppError(403, 'Access denied. You are not allowed to perform this action!'))
  }

  next()
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError(404, `There's no user with that email`))
  }

  const resetToken = user.generateResetPasswordToken()
  await user.save()

  const resetURL = `${req.protocol}://${req.get('host')}${endpoints.usersEndpoint}/${routes.userRoutes.resetPassword}/${resetToken}`

  try {
    await new Email(user, resetURL).sendResetPassword()

    returnSuccess(res, {}, 200, { message: 'Token sent to your email' })
  } catch (err) {
    console.error(err)
    user.resetPasswordResetToken()
    await user.save()

    return next(new AppError(500, 'There was an error sending the email. please try again later.'))
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const encryptedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    resetToken: encryptedToken,
    resetTokenExpired: { $gt: Date.now() }
  })

  // todo try to make this work
  // const user = await User.updateOne(
  //   {
  //     resetToken: encryptedToken,
  //     resetTokenExpired: { $gt: Date.now() }
  //   },
  //   { password: req.body.password },
  //   { validateModifiedOnly: true }
  // )

  if (!user) {
    return next(new AppError(400, 'Token is Invalid or Expired'))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.resetPasswordResetToken()
  await user.save()

  returnSuccess(res, {}, 200, { message: 'password has changed successfully' })
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  const {
    currentPassword,
    newPassword,
    passwordConfirm,
  } = req.body
  const user = await User.findById(req.user?._id)
    .select('+password')

  if (!await user.matchPasswords(currentPassword, user.password)) {
    return next(new AppError(401, 'Password is incorrect'))
  }

  user.password = newPassword
  user.passwordConfirm = passwordConfirm
  user.save()

  returnSuccess(res, {}, 200, { message: 'password has changed successfully' })
})
