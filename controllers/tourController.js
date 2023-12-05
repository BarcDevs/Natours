const Tour = require('../db/tourModel')
const { catchAsync } = require('./errorController')
const factory = require('./handlerFactory')
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

exports.getTours = factory.getMany(Tour)

exports.getTourById = factory.getById(Tour, {
  path: 'reviews',
  select: '-__v'
})

exports.createTour = factory.createOne(Tour)

exports.updateTour = factory.updateOne(Tour)

exports.deleteTour = factory.deleteOne(Tour)

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
//endregion
