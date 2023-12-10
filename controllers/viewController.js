const { catchAsync } = require('./errorController')
const Tour = require('../db/tourModel')

const render = (res, path, title, data = {}) => res.status(200)
  .render(path, {
    title,
    ...data
  })

exports.renderOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find()
  render(res, 'overview', 'All Tours', { tours })
})

exports.renderTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({
    slug: req.params.tourSlug
  })
    .populate({
      path: 'reviews',
      fields: 'review rating author'
    })

  render(res, 'tour', `${tour.name} Tour`, { tour })
})
