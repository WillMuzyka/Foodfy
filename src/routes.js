const express = require('express')
const routes = express.Router()
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

/* ~~~~~~ ADMIN ~~~~~~ */
/* recipes */
routes.get('/admin', adminRecipes.home)
routes.get('/admin/recipes', adminRecipes.index)
routes.get('/admin/recipes/create', adminRecipes.create)
routes.post('/admin/recipes', adminRecipes.post)
routes.get('/admin/recipes/:id', adminRecipes.show)
routes.get('/admin/recipes/:id/edit', adminRecipes.edit)
routes.put('/admin/recipes', adminRecipes.put)
routes.delete('/admin/recipes', adminRecipes.delete)
/* chefs */
routes.get('/admin/chefs', adminChefs.index)
routes.get('/admin/chefs/create', adminChefs.create)
routes.post('/admin/chefs', adminChefs.post)
routes.get('/admin/chefs/:id', adminChefs.show)
routes.get('/admin/chefs/:id/edit', adminChefs.edit)
routes.put('/admin/chefs', adminChefs.put)
routes.delete('/admin/chefs', adminChefs.delete)

module.exports = routes