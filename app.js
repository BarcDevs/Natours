//region REQUIRE
const express = require('express')
const config = require('./config')
//endregion

//region CONFIG
const app = express()
const { endpoints } = config
//endregion

module.exports = app
