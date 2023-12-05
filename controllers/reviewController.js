const Review = require('../db/reviewModel')
const factory = require('./handlerFactory')

exports.addTourFilter = (req, res, next) => {
  const { tourId } = req.params
  if (tourId) {
    req.body = {
      ...req.body,
      tour: tourId
    }
  }

  next()
}

exports.getReviews = factory.getMany(Review)

exports.getReviewById = factory.getById(Review)

exports.completeReviewData = (req, res, next) => {
  req.body.tour = req.params.tourId || req.body.tour
  req.body.author = req.user?._id

  next()
}

exports.createReview = factory.createOne(Review)

exports.deleteReview = factory.deleteOne(Review)
