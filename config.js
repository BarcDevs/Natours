const apiEndpoint = '/api/v1'

exports.endpoints = {
  url: 'http://localhost:8080/',
  root: '/',
  toursEndpoint: `${apiEndpoint}/tours`,
  usersEndpoint: `${apiEndpoint}/users`,
  reviewsEndpoint: `${apiEndpoint}/reviews`
}

exports.routes = {
  viewRoutes: {
    home: '/',
    tourDetails: '/tour/:tourSlug',
    login: '/login'
  },
  toursRoutes: {
    top5: '/top-5',
    stats: '/stats',
    monthlyPlan: '/monthly-plan',
    getToursWithin: '/tours-within/:distance/center/:latlng/unit/:unit',
    getToursDistances: '/tours-distances/center/:latlng/unit/:unit'
  },
  userRoutes: {
    signup: '/signup',
    login: '/login',
    logout: '/logout',

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
