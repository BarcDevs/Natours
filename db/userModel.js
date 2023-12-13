const crypto = require('crypto')
const {
  mongoose,
  Schema,
  model
} = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const { addMinutes } = require('date-fns')
const AppError = require('../utils/AppError')

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'user name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    trim: true,
    validate: [validator.isEmail, 'email is invalid'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: [8, 'password must be at least 8 characters'],
    select: false
  },
  passwordConfirm: String,
  picture: {
    type: String,
    default: 'public/img/users/default.jpg'
  },
  passwordLastChangeAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  resetToken: {
    type: String,
    select: false
  },
  resetTokenExpired: {
    type: Date,
    select: false
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

//region Middlewares
/* validate password */
userSchema.pre(/(save|update)/, {
  document: true,
  query: false
}, function(next) {
  if (!this.isModified('password')) return next()
  if (!this.passwordConfirm) return next(new AppError(400, 'Validation error: password confirm is required'))
  if (this.password !== this.passwordConfirm) {
    return next(new AppError(400, 'Validation error: Passwords must be the same'))
  }

  next()
})

/* encrypt password */
userSchema.pre(/(save|update)/, {
  document: true,
  query: false
}, async function(next) {
  if (!this.isModified('password')) return next()

  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT))
  this.password = await bcrypt.hash(this.password, salt)

  this.passwordConfirm = undefined
  this.passwordLastChangeAt = Date.now()

  next()
})

/* filter deleted users */
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } })
  next()
})
//endregion

//region Instance methods
userSchema.methods.matchPasswords = async function(input, userPassword) {
  return await bcrypt.compare(input, userPassword)
}

userSchema.methods.generateResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32)
    .toString('hex')

  this.resetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetTokenExpired = addMinutes(Date.now(), 10)

  return resetToken
}

userSchema.methods.resetPasswordResetToken = function() {
  this.resetToken = undefined
  this.resetTokenExpired = undefined
}
//endregion

//region Virtuals
userSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'author',
  localField: '_id'
})
//endregion

const User = model('User', userSchema)

module.exports = User
