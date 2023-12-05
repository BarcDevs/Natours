const { catchAsync } = require('./errorController')
const Review = require('../db/reviewModel')
const { returnSuccess } = require('../utils/responses')
const queryBuilder = require('../db/query')
const AppError = require('../utils/AppError')

exports.getReviews = catchAsync(async (req, res, next) => {
  const tour = req.params.tourId
  const query = queryBuilder(Review, req.query, tour ? { tour } : {})
  const reviews = await query

  returnSuccess(res, { reviews }, 200, { results: reviews.length })
})

exports.getReviewById = catchAsync(async (req, res, next) => {
  const review = Review.findById(req.params.id)

  if (!review) {
    return next(
      new AppError(404, `No tour found for ID ${req.params.id}`)
    )
  }

  returnSuccess(res, { review })
})

exports.createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create({
    ...req.body,
    tour: req.params.tourId || req.body.tour,
    author: req.user?._id
  })

  returnSuccess(res, { review }, 201)
})
