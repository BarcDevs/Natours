const Tour = require('../db/tourModel')
const { catchAsync } = require('./errorController')
const factory = require('./handlerFactory')
const { returnSuccess } = require('../utils/responses')
const AppError = require('../utils/AppError')

const EARTH_RADIUS_KM = 6378.1
const EARTH_RADIUS_MILES = 3963.2

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const {
    distance,
    latlng,
    unit
  } = req.params
  const [lat, lng] = latlng.split(',')
  const radius = distance / (unit === 'mi' ? EARTH_RADIUS_MILES : EARTH_RADIUS_KM)

  if (!lat || !lng) return next(new AppError(400, 'Please provide latitude and longitude in the format lat,lng'))

  const tours = await Tour.find({
    startLocation: {
      coordinates: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radius]
        }
      }
    }
  })

  returnSuccess(res, { tours }, 200, { results: tours.length })
})
//endregion
