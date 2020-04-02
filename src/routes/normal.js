const express = require('express')
const routes = express.Router()

const normalRecipes = require('../app/controllers/normal/recipes')
const normalChefs = require('../app/controllers/normal/chefs')
/* ~~~~~~ NORMAL ~~~~~~ */
/* recipes */
routes.get('/', normalRecipes.home)
routes.get('/about', normalRecipes.about)
routes.get('/recipes', normalRecipes.index)
routes.get('/recipes/:id', normalRecipes.show)
/* chefs */
routes.get('/chefs', normalChefs.index)
routes.get('/chefs/:id', normalChefs.show)


module.exports = routes