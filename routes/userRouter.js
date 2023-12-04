const express = require('express')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protectRoute,
  updateUserData,
  deleteUser
} = require('../controllers/authController')
const { routes: r } = require('../config')

const routes = r.userRoutes
const router = express.Router()

// todo move route declaration to config
router.post(routes.signup, signup)
router.post(routes.login, login)

router.patch(routes.updatePassword, protectRoute, updatePassword)
router.post(routes.forgotPassword, forgotPassword)
router.patch(routes.resetPassword, resetPassword)

router.patch(routes.update, protectRoute, updateUserData)
router.delete(routes.delete, protectRoute, deleteUser)

// router
//   .route('/')
//   .get(getUsers)
//   .post(createUser)
//
// router
//   .route('/:id')
//   .get(getUserById)
//   .patch(updateUser)
//   .delete(deleteUser)

module.exports = router
