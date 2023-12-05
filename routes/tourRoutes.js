const express = require('express')
const {
  aliasTopTours,
  getTours,
  createTour,
  deleteTour,
  getTourById,
  updateTour,
  getToursStats,
  getMonthlyPlan
} = require('../controllers/tourController')
const { routes: r } = require('../config')
const {
  protectRoute,
  restrictRoute
} = require('../controllers/authController')
const reviewRouter = require('./reviewRoutes')

const routes = r.toursRoutes
const router = express.Router()

router.use('/:tourId/reviews', reviewRouter)

router
  .route('/')
  .get(
    protectRoute,
    getTours
  )
  .post(
    protectRoute,
    restrictRoute('admin', 'lead-guide'),
    createTour
  )

router
  .route(routes.top5)
  .get(aliasTopTours, getTours)

router
  .route(routes.stats)
  .get(getToursStats)

router
  .route(`${routes.monthlyPlan}/:year`)
  .get(
    protectRoute,
    restrictRoute('admin', 'lead-guide', 'guide'),
    getMonthlyPlan
  )

router
  .route('/:id')
  .get(protectRoute, getTourById)
  .patch(
    protectRoute,
    restrictRoute('admin', 'lead-guide'),
    updateTour
  )
  .delete(
    protectRoute,
    restrictRoute('admin', 'lead-guide'),
    deleteTour
  )

module.exports = router
