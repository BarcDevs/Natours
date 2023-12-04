const Tour = require('../db/tourModel')
const queryBuilder = require('../db/query')
const { catchAsync } = require('./errorController')
const AppError = require('../utils/AppError')
const { returnSuccess } = require('../utils/responses')

//region CONTROLLERS
exports.aliasTopTours = (req, res, next) => {
  req.query = {
    ...req.query,
    limit: 5,
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty'
  }

  next()
}

exports.getTours = catchAsync(async (req, res, next) => {
  const query = queryBuilder(Tour, req.query)
  const tours = await query

  returnSuccess(res, { tours }, 200, { results: tours.length })
})

exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  if (!tour) {
    return next(
      new AppError(404, `No tour found for ID ${req.params.id}`)
    )
  }

  returnSuccess(res, { tour })
})

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)

  returnSuccess(res, { tour: newTour }, 201)
})

exports.updateTour = catchAsync(async (req, res, next) => {
  const newChanges = req.body
  const { id } = req.params

  const tour = await Tour.findByIdAndUpdate(id, newChanges, {
    new: true,
    runValidators: true
  })

  if (!tour) {
    return next(
      new AppError(404, `No tour found for ID ${req.params.id}`)
    )
  }

  returnSuccess(res, { tour }, 202)
})

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if (!tour) {
    return next(
      new AppError(404, `No tour found for ID ${req.params.id}`)
    )
  }

  returnSuccess(res, {}, 204)
})

exports.getToursStats = catchAsync(async (req, res, next) => {
  const tourStats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$difficulty',
        tours: { $sum: 1 },
        ratings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$ratingsAverage' },
        maxPrice: { $max: '$ratingsAverage' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ])

  returnSuccess(res, { tourStats }, 201)
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year)

  const monthlyPlan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $limit: 12 },
    { $sort: { tourStarts: -1 } }
  ])

  returnSuccess(res, { monthlyPlan }, 201)
})
