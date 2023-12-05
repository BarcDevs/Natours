const express = require('express')
const {
  getReviews,
  createReview,
  getReviewById
} = require('../controllers/reviewController')
const {
  protectRoute,
  restrictRoute
} = require('../controllers/authController')

const router = express.Router({
  mergeParams: true
})

router
  .route('/')
  .get(getReviews)
  .post(
    protectRoute,
    restrictRoute('user'),
    createReview
  )

router
  .route('/:id')
  .get(getReviewById)

module.exports = router
