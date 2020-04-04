const express = require('express')
const routes = express.Router()

const UserController = require('../app/controllers/admin/UserController')
const UserValidator = require('../app/validators/user')
const SessionValidator = require('../app/validators/session')
//index
routes.get("/index", SessionValidator.onlyAdmin, UserController.index)

//register
routes.get("/register", SessionValidator.onlyAdmin, UserController.create)
routes.post("/register", SessionValidator.onlyAdmin, UserValidator.post, UserController.post)

//show
routes.get("/:id", UserValidator.isOwnerOfAccount, UserController.edit)
routes.put("/", UserValidator.isOwnerOfAccount, UserController.update)
routes.delete("/", SessionValidator.onlyAdmin, UserValidator.isDeletingOwnAccount, UserController.delete)

module.exports = routes