const {
  Schema,
  model
} = require('mongoose')

const bookingSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now()
  },
  tour: {
    type: Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'booking must belong to a tour']
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'booking must belong to a user']
  },
  price: {
    type: Number,
    required: [true, 'booking must have a price']
  },
  paid: {
    type: Boolean,
    default: true
  }
})

bookingSchema.index({ createdAt: -1 })

bookingSchema.pre(/^find/, function(next) {
  this
    .populate({
      path: 'tour',
      select: 'name'
    })
    .populate({
      path: 'user',
      select: 'name email'
    })

  next()
})

const Booking = model('booking', bookingSchema)

module.exports = Booking
