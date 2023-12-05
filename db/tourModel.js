const { Schema, model } = require('mongoose')

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
    }
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
      validator: function (discount) {
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
  }]
})

const Tour = model('Tour', tourSchema)

module.exports = Tour
