const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/normal/SessionController')
const SessionValidator = require('../app/validators/session')

// login and logout
routes.get("/login", SessionValidator.isLogged, SessionController.loginForm)
routes.post("/login", SessionValidator.login, SessionController.login)
routes.post("/logout", SessionController.logout)

// reset-password and first-login
routes.get("/forgot-password", SessionController.forgotForm)
routes.get("/password-reset", SessionController.resetForm)
routes.get("/first-login", SessionController.firstLoginForm)
routes.post("/forgot-password", SessionValidator.forgot, SessionController.forgot)
routes.post("/password-reset", SessionValidator.reset, SessionController.reset)
routes.post("/first-login", SessionValidator.firstLogin, SessionController.firstLogin)

module.exports = routes