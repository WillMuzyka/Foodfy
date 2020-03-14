const express = require('express')
const routes = express.Router()
const user = require('./controllers/user')
const admin = require('./controllers/admin')
/* USER */
routes.get('/', user.home)
routes.get('/about', user.about)
routes.get('/recipes', user.recipes)
routes.get('/recipes/:recipeID', user.show)

/* ADMIN */
routes.get('/admin', admin.home)
routes.get('/admin/recipes', admin.index)
routes.get('/admin/recipes/create', admin.create)
routes.post('/admin/recipes', admin.post)
routes.get('/admin/recipes/:id', admin.show)
routes.get('/admin/recipes/:id/edit', admin.edit)
routes.put('/admin/recipes', admin.put)
routes.delete('/admin/recipes', admin.delete)


module.exports = routes