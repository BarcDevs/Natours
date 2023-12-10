const { catchAsync } = require('./errorController')
const Tour = require('../db/tourModel')

const render = (res, path, data = {}) => res.status(200)
  .render(path, data)

exports.renderOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()
  render(res, 'overview', {
    title: 'All Tours',
    tours
  })
})

exports.renderTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({
    slug: req.params.tourSlug
  }).populate({
    path: 'reviews',
    fields: 'review rating author'
  })

  render(res, 'tour', {
    title: `${tour.name} Tour`,
    tour
  })
})
