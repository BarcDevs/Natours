const express = require('express')
const { routes: r } = require('../config')
const {
  renderOverview,
  renderTour,
  renderLogin
} = require('../controllers/viewController')
const { isLoggedIn } = require('../controllers/authController')

const router = express.Router()
const routes = r.viewRoutes

router.use(isLoggedIn)
router.get(routes.home, renderOverview)
router.get(routes.tourDetails, renderTour)

router.get(routes.login, renderLogin)

module.exports = router
