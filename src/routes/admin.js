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
// index 
routes.get('/', Recipes.home)
routes.get('/recipes', Recipes.index)
// create
routes.get('/recipes/create', Recipes.create)
routes.post('/recipes', multer.array("photos", uploadLimit), Recipes.post)
//show, edit and delete
routes.get('/recipes/:id', UserValidator.canShowEditButton, Recipes.show)
routes.get('/recipes/:id/edit', UserValidator.isOwnerOfRecipe, Recipes.edit)
routes.put('/recipes', multer.array("photos", uploadLimit), UserValidator.isOwnerOfRecipe, Recipes.put)
routes.delete('/recipes', UserValidator.isOwnerOfRecipe, Recipes.delete)

/* chefs */
// index 
routes.get('/chefs', SessionValidator.onlyAdmin, Chefs.index)
// create
routes.get('/chefs/create', SessionValidator.onlyAdmin, Chefs.create)
routes.post('/chefs', multer.single("avatar"), SessionValidator.onlyAdmin, Chefs.post)
//show, edit and delete
routes.get('/chefs/:id', SessionValidator.onlyAdmin, Chefs.show)
routes.get('/chefs/:id/edit', SessionValidator.onlyAdmin, Chefs.edit)
routes.put('/chefs', multer.single("avatar"), SessionValidator.onlyAdmin, Chefs.put)
routes.delete('/chefs', SessionValidator.onlyAdmin, Chefs.delete)


module.exports = routes