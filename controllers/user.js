const data = require("../src/data.json")
const aboutText = require("../src/about")

module.exports = {
	home: (req, res) => {
		const recipes = data.recipes
		return res.render('user/home', { recipes })
	},
	about: (req, res) => {
		return res.render('user/about', { aboutText })
	},
	recipes: (req, res) => {
		const recipes = data.recipes
		return res.render('user/recipes', { recipes })
	},
	show: (req, res) => {
		const recipes = data.recipes
		const id = req.params.recipeID % recipes.length
		const showingRecipe = recipes[id]
		return res.render('user/show', { recipe: showingRecipe })
	}
}