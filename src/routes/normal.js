const express = require('express')
const routes = express.Router()

const Recipes = require('../app/controllers/normal/RecipeController')
const Chefs = require('../app/controllers/normal/ChefController')
/* ~~~~~~ NORMAL ~~~~~~ */
/* recipes */
routes.get('/', Recipes.home)
routes.get('/about', Recipes.about)
routes.get('/recipes', Recipes.index)
routes.get('/recipes/:id', Recipes.show)

/* chefs */
routes.get('/chefs', Chefs.index)
routes.get('/chefs/:id', Chefs.show)


module.exports = routes