const express = require('express')
const { routes: r } = require('../config')
const {
  renderOverview,
  renderTour,
  renderLogin,
  renderProfile,
  renderMe
} = require('../controllers/viewController')
const {
 isLoggedIn,
  protectRoute
} = require('../controllers/authController')

const router = express.Router()
const routes = r.viewRoutes

router.get(routes.me, protectRoute, renderMe)

router.use(isLoggedIn)
router.get(routes.home, renderOverview)
router.get(routes.tourDetails, renderTour)

router.get(routes.login, renderLogin)

module.exports = router
