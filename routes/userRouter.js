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

// todo move route declaration to config
router.post(routes.signup, signup)
router.post(routes.login, login)

router.patch(routes.updatePassword, protectRoute, updatePassword)
router.post(routes.forgotPassword, forgotPassword)
router.patch(routes.resetPassword, resetPassword)

router.patch(routes.update, protectRoute, updateUserData)
router.get(routes.getMe, protectRoute, getMe, getUserById)
router.delete(routes.delete, protectRoute, deactivateUser)

router.get(routes.reviews, protectRoute, getUserReviews)

router
  .route('/:id')
  .get(
    protectRoute,
    getUserById
  )
  .delete(
    protectRoute,
    restrictRoute('admin'),
    deleteUser
  )

router
  .route('/')
  .get(
    protectRoute,
    restrictRoute('admin'),
    getUsers
  )
//   .post(createUser)
//
// router
//   .route('/:id')
//   .get(getUserById)
//   .patch(updateUser)
//   .delete(deleteUser)

module.exports = router
