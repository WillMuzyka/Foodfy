const Chef = require("../../../models/Chef")
const Recipe = require("../../../models/Recipe")
const RecipeFile = require("../../../models/RecipeFile")

module.exports = {
	async index(req, res) {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 12
		const offset = limit * (page - 1)

		let chefs = await Chef.paginate({
			filter,
			limit,
			offset
		})

		chefs = chefs.map(chef => ({
			...chef,
			src: `${chef.path.replace("public", "")}`
		}))

		let total = 1
		if (chefs[0]) total = Math.ceil(chefs[0].total / limit)
		return res.render('normal/chefs/index', { chefs, filter, page, total, limit })
	},
	async show(req, res) {
		try {
			let chef = await Chef.find(req.params.id)
			if (chef) {
				chef = {
					...chef,
					src: `${chef.path.replace("public", "")}`
				}

				let recipes = await Recipe.findAll({
					where: { chef_id: chef.id }
				})

				const recipesFilePromises = recipes.map(recipe => {
					return RecipeFile.findAll(recipe.id)
				})
				const files = await Promise.all(recipesFilePromises)

				recipes = recipes.map((recipe, index) => ({
					...recipe,
					src: `${files[index][0].path.replace("public", "")}`
				}))

				return res.render('normal/chefs/show', { chef, recipes })
			}
		}
		catch (err) {
			console.error("Erro ao exibir chef", err)
		}
	}
}