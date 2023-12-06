const apiEndpoint = '/api/v1'

exports.endpoints = {
  toursEndpoint: `${apiEndpoint}/tours`,
  usersEndpoint: `${apiEndpoint}/users`,
  reviewsEndpoint: `${apiEndpoint}/reviews`
}

exports.routes = {
  toursRoutes: {
    top5: '/top-5',
    stats: '/stats',
    monthlyPlan: '/monthly-plan',
    getToursWithin: '/tours-within/:distance/center/:latlng/unit/:unit'
  },
  userRoutes: {
    signup: '/signup',
    login: '/login',

    updatePassword: '/updatePassword',
    forgotPassword: '/forgotPassword',
    resetPassword: '/resetPassword',

    getMe: '/me',
    update: '/updateUser',
    delete: '/deleteUser',

    reviews: '/reviews'
  },
  reviewRoutes: {

  }
}

exports.userAllowedFields = ['name', 'email']
