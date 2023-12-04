const apiEndpoint = '/api/v1'

exports.endpoints = {
  toursEndpoint: `${apiEndpoint}/tours`,
  usersEndpoint: `${apiEndpoint}/users`
}

exports.routes = {
  toursRoutes: {
    top5: '/top-5',
    stats: '/stats',
    monthlyPlan: '/monthly-plan'
  },
  userRoutes: {
    signup: '/signup',
    login: '/login',

    updatePassword: '/updatePassword',
    forgotPassword: '/forgotPassword',
    resetPassword: '/resetPassword',

    update: '/updateUser',
    delete: '/deleteUser'
  }
}

exports.userAllowedFields = ['name', 'email']
