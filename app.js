//region REQUIRE
const express = require('express')
const config = require('./config')
const { tourRouter } = require('./routes')
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

//region ROUTES
app.use(endpoints.toursEndpoint, tourRouter)
app.use(endpoints.usersEndpoint, userRouter)

// not found handler
app.all('*', notFound)

app.use(errorHandler)
module.exports = app
