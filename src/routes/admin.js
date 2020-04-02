const express = require('express')
const routes = express.Router()

const adminRecipes = require('../app/controllers/admin/recipes')
const adminChefs = require('../app/controllers/admin/chefs')

const multer = require('../app/middlewares/multer')
const uploadLimit = 5

/* ~~~~~~ ADMIN ~~~~~~ */
/* recipes */
routes.get('/', adminRecipes.home)
routes.get('/recipes', adminRecipes.index)
routes.get('/recipes/create', adminRecipes.create)
routes.post('/recipes', multer.array("photos", uploadLimit), adminRecipes.post)
routes.get('/recipes/:id', adminRecipes.show)
routes.get('/recipes/:id/edit', adminRecipes.edit)
routes.put('/recipes', multer.array("photos", uploadLimit), adminRecipes.put)
routes.delete('/recipes', adminRecipes.delete)
/* chefs */
routes.get('/chefs', adminChefs.index)
routes.get('/chefs/create', adminChefs.create)
routes.post('/chefs', multer.single("avatar"), adminChefs.post)
routes.get('/chefs/:id', adminChefs.show)
routes.get('/chefs/:id/edit', adminChefs.edit)
routes.put('/chefs', multer.single("avatar"), adminChefs.put)
routes.delete('/chefs', adminChefs.delete)


module.exports = routes