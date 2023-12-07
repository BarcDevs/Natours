const {
  Schema,
  model
} = require('mongoose')
const slugify = require('slugify')

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
    minLength: [10, 'name length must be at least 10 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Max group size is required']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'difficulty can only be \'easy\', \'medium\' or \'difficult\''
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    validate: {
      validator: rating => (!(rating < 1) && !(rating > 5)),
      message: 'rating must be between 1 and 5'
    },
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  priceDiscount: {
    type: Number,
    default: 0,
    validate: {
      validator: function(discount) {
        return discount < this.price
      },
      message: 'discount can\'t be greater than the price'
    }
  },
  summary: {
    type: String,
    default: '',
    trim: true
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required']
  },
  imageCover: {
    type: String,
    required: [true, 'Image cover is required']
  },
  images: {
    type: [String],
    default: []
  },
  startDates: {
    type: [Date],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  locations: [{
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    day: Number,
    coordinates: [Number],
    address: String,
    description: String
  }],
  startLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  guides: [{
    type: Schema.ObjectId,
    ref: 'User'
  }],
  slug: {
    type: String,
    unique: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

//region Indexes
tourSchema.index({
  price: 1,
  ratingsAverage: -1
})
tourSchema.index({ slug: 1 })
tourSchema.index({
  'startLocation.coordinates': '2dsphere'
})
tourSchema.index({
  'locations.coordinates': '2dsphere'
})
//endregion

//region Middlewares
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v'
  })

  next()
})

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})
//endregion

//region Virtuals
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
})
//endregion

const Tour = model('Tour', tourSchema)

module.exports = Tour
