const express = require('express')
const routes = express.Router()

const multer = require('./app/middlewares/multer')
const uploadLimit = 5

const userRecipes = require('./app/controllers/user/recipes')
const userChefs = require('./app/controllers/user/chefs')
const adminRecipes = require('./app/controllers/admin/recipes')
const adminChefs = require('./app/controllers/admin/chefs')

/* ~~~~~~ USER ~~~~~~ */
/* recipes */
routes.get('/', userRecipes.home)
routes.get('/about', userRecipes.about)
routes.get('/recipes', userRecipes.index)
routes.get('/recipes/:id', userRecipes.show)
/* chefs */
routes.get('/chefs', userChefs.index)
routes.get('/chefs/:id', userChefs.show)

/* ~~~~~~ ADMIN ~~~~~~ */
/* recipes */
routes.get('/admin', adminRecipes.home)
routes.get('/admin/recipes', adminRecipes.index)
routes.get('/admin/recipes/create', adminRecipes.create)
routes.post('/admin/recipes', multer.array("photos", uploadLimit), adminRecipes.post)
routes.get('/admin/recipes/:id', adminRecipes.show)
routes.get('/admin/recipes/:id/edit', adminRecipes.edit)
routes.put('/admin/recipes', multer.array("photos", uploadLimit), adminRecipes.put)
routes.delete('/admin/recipes', adminRecipes.delete)
/* chefs */
routes.get('/admin/chefs', adminChefs.index)
routes.get('/admin/chefs/create', adminChefs.create)
routes.post('/admin/chefs', multer.single("avatar"), adminChefs.post)
routes.get('/admin/chefs/:id', adminChefs.show)
routes.get('/admin/chefs/:id/edit', adminChefs.edit)
routes.put('/admin/chefs', multer.single("avatar"), adminChefs.put)
routes.delete('/admin/chefs', adminChefs.delete)

module.exports = routes