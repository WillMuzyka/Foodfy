const Recipe = require("../../../models/Recipe")
const RecipeFile = require("../../../models/RecipeFile")

const aboutText = require("../../about")

module.exports = {
	async home(req, res) {
		try {
			let results = await Recipe.all()
			let recipes = results.rows

			const recipesFilePromises = recipes.map(recipe => {
				return RecipeFile.find(recipe.id)
			})
			results = await Promise.all(recipesFilePromises)
			const files = results

			recipes = recipes.map((recipe, index) => ({
				...recipe,
				src: `${req.protocol}://${req.headers.host}${files[index].rows[0].path.replace("public", "")}`
			}))

			return res.render('normal/home', { recipes })
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
			limit = limit || 9
			const offset = limit * (page - 1)

			const params = {
				filter,
				limit,
				offset
			}

			let results = await Recipe.paginate(params)
			let recipes = results.rows

			const recipesFilePromises = recipes.map(recipe => {
				return RecipeFile.find(recipe.id)
			})
			results = await Promise.all(recipesFilePromises)
			const files = results

			recipes = recipes.map((recipe, index) => ({
				...recipe,
				src: `${req.protocol}://${req.headers.host}${files[index].rows[0].path.replace("public", "")}`
			}))

			let total = 1
			if (recipes[0]) total = Math.ceil(recipes[0].total / limit)
			return res.render('normal/recipes/index', { recipes, filter, page, total })
		}
		catch (err) {
			console.error(err)
		}
	},
	async show(req, res) {
		try {
			let results = await Recipe.find(req.params.id)
			const recipe = results.rows[0]

			results = await RecipeFile.find(recipe.id)
			let files = results.rows

			files = addSrcFromPath(files, req)

			return res.render('normal/recipes/show', { recipe, files })
		}
		catch (err) {
			console.error(err)
		}
	}
}