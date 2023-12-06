const express = require('express')
const {
  getReviews,
  createReview,
  getReviewById,
  deleteReview,
  completeReviewData,
  addTourFilter,
  updateReview
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
  .patch(protectRoute, restrictRoute('user'), updateReview)
  .delete(protectRoute, restrictRoute('user'), deleteReview)

module.exports = router
