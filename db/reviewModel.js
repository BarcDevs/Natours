const {
  Schema,
  model
} = require('mongoose')

const reviewSchema = new Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    validate: {
      validator: rating => (!(rating < 1) && !(rating > 5)),
      message: 'rating must be between 1 and 5'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  tour: {
    type: Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour']
  },
  author: {
    type: Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to an author']
  }
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

reviewSchema.pre(/^find/, function(next) {
  this
    // .populate({
    //   path: 'tour',
    //   select: 'name'
    // })
    .populate({
      path: 'author',
      select: 'name picture'
    })

  next()
})
const ReviewSchema = model('Review', reviewSchema)

module.exports = ReviewSchema
