const express = require('express')
const { routes: r } = require('../config')
const { renderRoot } = require('../controllers/viewHandler')

const router = express.Router()
const routes = r.viewRoutes

router.get('/', renderRoot)
module.exports = router
