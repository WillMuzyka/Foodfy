const Chef = require("../../../models/Chef")
const RecipeFile = require("../../../models/RecipeFile")

module.exports = {
	async index(req, res) {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 16
		const offset = limit * (page - 1)

		const params = {
			filter,
			limit,
			offset
		}
		let results = await Chef.paginate(params)
		let chefs = results.rows

		chefs = chefs.map(chef => ({
			...chef,
			src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
		}))

		let total = 1
		if (chefs[0]) total = Math.ceil(chefs[0].total / limit)
		return res.render('user/chefs', { chefs, filter, page, total })

	},
	async show(req, res) {
		try {
			let results = await Chef.find(req.params.id)
			if (results.rows[0]) {
				let chef = results.rows[0]
				chef = {
					...chef,
					src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
				}

				results = await Chef.recipesPublished(chef.id)
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

				return res.render('user/showChef', { chef, recipes })
			}
		}
		catch (err) {
			console.log("Erro ao exibir chef", err)
		}
	}
}