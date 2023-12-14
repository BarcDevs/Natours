//region REQUIRE
const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const { xss } = require('express-xss-sanitizer')
const morgan = require('morgan')
const hpp = require('hpp')
const path = require('path')
const config = require('./config')
const {
  tourRouter,
  reviewRouter,
  viewRouter,
  bookingRouter
} = require('./routes')
const { userRouter } = require('./routes')
const {
  notFound,
  errorHandler
} = require('./controllers/errorController')
//endregion

//region CONFIG
const app = express()
const { endpoints } = config
//endregion

//region Options
const limiter = rateLimit({
  max: process.env.MAX_REQUEST_LIMIT,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. try again later'
})

const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\'', 'checkout.stripe.com', 'js.stripe.com', 'api.mapbox.com', 'events.mapbox.com', 'ws://localhost:53088'],
      scriptSrc: ['\'self\'', 'checkout.stripe.com', 'js.stripe.com', 'api.mapbox.com', 'ws://localhost:53088'],
      workerSrc: ['\'self\'', 'blob:'],
      imgSrc: ['\'self\'', 'blob:', 'data:']
    }
  }
}
//endregion

//region MIDDLEWARE
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(cors())
app.options('*', cors())
app.use(helmet(helmetOptions))
app.use(xss({
  allowedKeys: ['name']
}))
app.use(mongoSanitize())
app.use(hpp({
  whitelist: ['duration', 'ratingsAverage', 'price', 'ratingsQuantity', 'maxGroupSize', 'priceDiscount', 'difficulty']
}))
app.use('/api', limiter)

app.use(express.json({
  limit: '10kb'
}))
app.use(cookieParser())
app.use(compression())
//endregion

//region ROUTES
app.use(endpoints.root, viewRouter)
app.use(endpoints.toursEndpoint, tourRouter)
app.use(endpoints.usersEndpoint, userRouter)
app.use(endpoints.reviewsEndpoint, reviewRouter)
app.use(endpoints.bookingsEndpoint, bookingRouter)

// not found handler
app.all('*', notFound)

app.use(errorHandler)
module.exports = app
