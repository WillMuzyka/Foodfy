const Recipe = require("../../../models/Recipe")
const RecipeFile = require("../../../models/RecipeFile")

const { showMessage } = require("../../../lib/utils")
const aboutText = require("../../views/normal/about")

module.exports = {
	async home(req, res) {
		try {
			let recipes = await Recipe.all()

			const recipesFilePromises = recipes.map(recipe => {
				return RecipeFile.findAll(recipe.id)
			})
			const files = await Promise.all(recipesFilePromises)

			recipes = recipes.map((recipe, index) => ({
				...recipe,
				src: `${files[index][0].path.replace("public", "")}`
			}))

			return res.render('normal/home', {
				recipes,
				error: showMessage(req.query.mes),
				success: showMessage(req.query.suc),
			})
		}
		catch (err) {
			console.error(err)
		}
	},
	about(req, res) {
		return res.render('normal/about', { aboutText })
	},
	async index(req, res) {
		try {
			let { filter, page, limit } = req.query
			page = page || 1
			limit = limit || 6
			const offset = limit * (page - 1)

			const params = {
				filter,
				limit,
				offset,
				admin: true,
				userId: null
			}

			let recipes = await Recipe.paginate(params)

			const recipesFilePromises = recipes.map(recipe => {
				return RecipeFile.findAll(recipe.id)
			})
			const files = await Promise.all(recipesFilePromises)

			recipes = recipes.map((recipe, index) => ({
				...recipe,
				src: `${files[index][0].path.replace("public", "")}`
			}))

			let total = 1
			if (recipes[0]) total = Math.ceil(recipes[0].total / limit)
			return res.render('normal/recipes/index', { recipes, filter, page, total, limit })
		}
		catch (err) {
			console.error(err)
		}
	},
	async show(req, res) {
		try {
			const recipe = await Recipe.find(req.params.id)

			let files = await RecipeFile.findAll(recipe.id)

			files = addSrcFromPath(files, req)

			return res.render('normal/recipes/show', { recipe, files })
		}
		catch (err) {
			console.error(err)
		}
	}
}