const multer = require('multer')
const sharp = require('sharp')
const Tour = require('../db/tourModel')
const { catchAsync } = require('./errorController')
const factory = require('./handlerFactory')
const { returnSuccess } = require('../utils/responses')
const AppError = require('../utils/AppError')

const EARTH_RADIUS_KM = 6378.1
const EARTH_RADIUS_MILES = 3963.2

//region CONTROLLERS
const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    cb(new AppError(400, 'Not an image! please upload images only.'), false)
  } else {
    cb(null, true)
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

exports.updateTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1
  },
  {
    name: 'images',
    maxCount: 3
  }
])

exports.resizeTourImages = async (req, res, next) => {
  if (!(req.files.imageCover || req.files.images)) return next()

  const resolution = [2000, 1333]

  await Promise.all(Object.entries(req.files)
    .map(async ([name, images]) => {
        await Promise.all(images.map(async (image, i) => {
          const filename = `tour-${req.params.id}-${Date.now()}-${name === 'imageCover' ? 'cover' : i + 1}.jpeg`

          await sharp(image.buffer)
            .resize(...resolution)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`public/img/tours/${filename}`)

          if (images.length === 1) {
            req.body[name] = filename
          } else {
            // try to push filename to array. if undefined, make a new array
            try {
              req.body[name].push(filename)
            } catch (e) {
              req.body[name] = [filename]
            }
          }
        }))
      }
    )
  )

  next()
}

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

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const {
    latlng,
    unit
  } = req.params
  const [lat, lng] = latlng.split(',')
  const multiplier = (unit === 'mi' ? 0.00062137119 : 0.001)

  if (!lat || !lng) return next(new AppError(400, 'Please provide latitude and longitude in the format lat,lng'))

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [Number(lng), Number(lat)]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
        key: 'startLocation.coordinates',
        includeLocs: 'loc'
      }
    },
    {
      $project: {
        distance: 1,
        name: 1,
        loc: 1
      }
    }
  ])

  returnSuccess(res, { distances })
})
//endregion
