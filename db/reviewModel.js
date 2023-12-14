const {
  Schema,
  model
} = require('mongoose')
const Tour = require('./tourModel')

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

reviewSchema.index({
  tour: 1,
  author: 1
}, {
  unique: true
})
reviewSchema.index({ rating: -1 })

reviewSchema.statics.calculateRatings = async function(tourID) {
  const stats = (await this.aggregate([
    { $match: { tour: tourID } },
    {
      $group: {
        _id: '$tour',
        ratings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]))[0]

  await Tour.findByIdAndUpdate(tourID, {
    ratingsQuantity: stats?.ratings || 0,
    ratingsAverage: stats?.avgRating || 4.5
  })
}
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

reviewSchema.post('save', function() {
  this.constructor.calculateRatings(this.tour)
})

reviewSchema.post(/^findOneAnd/, async doc => {
  if (doc) {
    doc.constructor.calculateRatings(doc.tour)
  }
})

const Review = model('Review', reviewSchema)

module.exports = Review
