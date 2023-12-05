const express = require('express')
const {
  getReviews,
  createReview,
  getReviewById
} = require('../controllers/reviewController')
const { protectRoute } = require('../controllers/authController')

const router = express.Router()

router
  .route('/')
  .get(getReviews)
  .post(protectRoute, createReview)

router
  .route('/:id')
  .get(getReviewById)

module.exports = router
