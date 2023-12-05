const express = require('express')
const {
  getReviews,
  createReview,
  getReviewById,
  deleteReview,
  completeReviewData,
  addTourFilter
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
  .get(
    addTourFilter,
    getReviews
  )
  .post(
    protectRoute,
    restrictRoute('user'),
    completeReviewData,
    createReview
  )

router
  .route('/:id')
  .get(getReviewById)
  .delete(protectRoute, deleteReview)

module.exports = router
