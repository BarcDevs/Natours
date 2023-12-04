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
  picture: String,
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
})

const User = model('User', userSchema)

module.exports = User
