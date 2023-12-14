const express = require('express')
const {
 protectRoute,
  restrictRoute
} = require('../controllers/authController')
const {
 getCheckoutSession,
  getBookings,
  createBooking,
  getBookingById,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController')

const router = express.Router({
  mergeParams: true
})

router.use(protectRoute)
router
  .post('/checkout/:tourID', getCheckoutSession)

router.use(restrictRoute('admin', 'lead-guide'))
router.route('/')
  .get(getBookings)
  .post(createBooking)

router.route('/:id')
  .get(getBookingById)
  .patch(updateBooking)
  .delete(deleteBooking)
module.exports = router
