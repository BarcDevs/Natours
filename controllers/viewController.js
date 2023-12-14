const { catchAsync } = require('./errorController')
const Tour = require('../db/tourModel')
const AppError = require('../utils/AppError')
const Booking = require('../db/bookingModel')

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

  if (!tour) return next(new AppError(404, `Tour "${req.params.tourSlug}" not found!`))

  render(res, 'tour', `${tour.name} Tour`, { tour })
})

exports.renderLogin = (req, res) => {
  render(res, 'login', 'Login')
}

// exports.renderProfile = (req, res) => {
//   render(res, 'account', 'Login')
// }

exports.renderMe = (req, res) => {
  render(res, 'account', 'Your profile')
}

exports.renderMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id })

  const tourIDs = bookings.map(el => el.tour)
  const tours = Tour.find({ _id: { $in: tourIDs } })

  render(res, 'overview', 'My Bookings', { tours })
})
