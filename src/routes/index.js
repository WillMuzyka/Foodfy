const express = require('express')
const routes = express.Router()

const normal = require('./normal')
const admin = require('./admin')

routes.use('/', normal)
routes.use('/admin', admin)


module.exports = routes