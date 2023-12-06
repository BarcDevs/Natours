const express = require('express')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protectRoute,
  restrictRoute
} = require('../controllers/authController')
const { routes: r } = require('../config')
const {
  deactivateUser,
  getUsers,
  updateUserData,
  deleteUser,
  getUserReviews,
  getMe,
  getUserById
} = require('../controllers/userController')

const routes = r.userRoutes
const router = express.Router()

router.post(routes.signup, signup)
router.post(routes.login, login)
router.post(routes.forgotPassword, forgotPassword)
router.patch(routes.resetPassword, resetPassword)

/* Protected routes */
router.use(protectRoute)

router.patch(routes.updatePassword, updatePassword)
router.patch(routes.update, updateUserData)
router.get(routes.getMe, getMe, getUserById)
router.delete(routes.delete, deactivateUser)
router.get(routes.reviews, getUserReviews)
router.get('/:id', getUserById)

/* Routes for admin use only */
router.use(restrictRoute('admin'))

router.delete('/:id', deleteUser)
router.get(getUsers)

module.exports = router
