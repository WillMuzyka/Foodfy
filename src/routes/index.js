const express = require('express')
const routes = express.Router()

const SessionValidator = require('../app/validators/session')

const normal = require('./normal')
const session = require('./session')
const user = require('./user')
const admin = require('./admin')

routes.use('/', normal)
routes.use('/session', session)
routes.use('/users', SessionValidator.onlyUser, user)
routes.use('/admin', SessionValidator.onlyUser, admin)

/* ALIAS */
routes.get('/login', (req, res) => res.redirect("session/login"))


module.exports = routes