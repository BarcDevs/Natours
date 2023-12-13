const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { catchAsync } = require('./errorController')
const Tour = require('../db/tourModel')
const { returnSuccess } = require('../utils/responses')

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID)
  const url = `${req.protocol}://${req.get('host')}`

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: url,
    cancel_url: `${url}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [{
      name: `${tour.name} Tour`,
      description: tour.summary,
      images: [`${url}/img/tours/${tour.imageCover}`],
      amount: tour.price * 100,
      currency: 'usd',
      quality: 1
    }]
  })

  returnSuccess(res, {}, 200, { session })
})
