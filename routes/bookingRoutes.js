const express = require('express')
const { protectRoute } = require('../controllers/authController')
const { getCheckoutSession } = require('../controllers/bookingController')

const router = express.Router({
  mergeParams: true
})

router
  .post('/checkout/:tourID', protectRoute, getCheckoutSession)

module.exports = router
