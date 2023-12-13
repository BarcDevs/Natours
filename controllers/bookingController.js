const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { catchAsync } = require('./errorController')
const Tour = require('../db/tourModel')
const { returnSuccess } = require('../utils/responses')

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourID)
  const url = `${req.protocol}://${req.get('host')}`

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: url,
    cancel_url: `${url}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [{
      price_data: {
        currency: 'usd',
        unit_amount: tour.price * 100,
        product_data: {
      description: tour.summary,
          name: `${tour.name} Tour`,
          images: [`${url}/img/tours/${tour.imageCover}`]
        }
      },
      quantity: 1
    }]
  })

  returnSuccess(res, {}, 200, {session})
})
