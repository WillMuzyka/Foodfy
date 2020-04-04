const express = require('express')
const routes = express.Router()

const Recipes = require('../app/controllers/admin/RecipeController')
const Chefs = require('../app/controllers/admin/ChefController')
const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/user')

const multer = require('../app/middlewares/multer')
const uploadLimit = 5

/* ~~~~~~ ADMIN ~~~~~~ */
/* recipes */
routes.get('/', Recipes.home)
routes.get('/recipes', Recipes.index)
routes.get('/recipes/create', Recipes.create)
routes.post('/recipes', multer.array("photos", uploadLimit), Recipes.post)
routes.get('/recipes/:id', UserValidator.canShowEditButton, Recipes.show)
routes.get('/recipes/:id/edit', UserValidator.isOwnerOfRecipe, Recipes.edit)
routes.put('/recipes', multer.array("photos", uploadLimit), UserValidator.isOwnerOfRecipe, Recipes.put)
routes.delete('/recipes', UserValidator.isOwnerOfRecipe, Recipes.delete)
/* chefs */
routes.get('/chefs', Chefs.index)
routes.get('/chefs/create', SessionValidator.onlyAdmin, Chefs.create)
routes.post('/chefs', SessionValidator.onlyAdmin, multer.single("avatar"), Chefs.post)
routes.get('/chefs/:id', Chefs.show)
routes.get('/chefs/:id/edit', SessionValidator.onlyAdmin, Chefs.edit)
routes.put('/chefs', SessionValidator.onlyAdmin, multer.single("avatar"), Chefs.put)
routes.delete('/chefs', SessionValidator.onlyAdmin, Chefs.delete)


module.exports = routes