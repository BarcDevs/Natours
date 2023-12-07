//region REQUIRE
const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const { xss } = require('express-xss-sanitizer')
const morgan = require('morgan')
const hpp = require('hpp')
const path = require('path')
const config = require('./config')
const {
  tourRouter,
  reviewRouter,
  viewRouter
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

//region MIDDLEWARE
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

const limiter = rateLimit({
  max: process.env.MAX_REQUEST_LIMIT,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests. try again later'
})

app.use(helmet())
app.use(xss({
  allowedKeys: ['name']
}))
app.use(mongoSanitize())
app.use('/api', limiter)
app.use(express.json({
  limit: '10kb'
}))
app.use(hpp({
  whitelist: ['duration', 'ratingsAverage', 'price', 'ratingsQuantity', 'maxGroupSize', 'priceDiscount', 'difficulty']
}))
//endregion

//region ROUTES
app.use(endpoints.root, viewRouter)
app.use(endpoints.toursEndpoint, tourRouter)
app.use(endpoints.usersEndpoint, userRouter)
app.use(endpoints.reviewsEndpoint, reviewRouter)

// not found handler
app.all('*', notFound)

app.use(errorHandler)
module.exports = app
