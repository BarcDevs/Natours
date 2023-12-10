const express = require('express')
const { routes: r } = require('../config')
const {
  renderOverview,
  renderTour
} = require('../controllers/viewController')

const router = express.Router()
const routes = r.viewRoutes

router.get(routes.home, renderOverview)
router.get(routes.tourDetails, renderTour)

module.exports = router
