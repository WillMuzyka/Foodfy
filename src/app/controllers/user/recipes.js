const Recipe = require("../../../models/Recipe")
const aboutText = require("../../about")

module.exports = {
	async home(req, res) {
		try {
			const results = await Recipe.all()
			const recipes = results.rows
			return res.render('user/home', { recipes })
		}
		catch (err) {
			throw (err)
		}
	},
	about(req, res) {
		return res.render('user/about', { aboutText })
	},
	async index(req, res) {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 9
		const offset = limit * (page - 1)

		const params = {
			filter,
			limit,
			offset
		}

		try {
			const results = await Recipe.paginate(params)
			const recipes = results.rows

			let total = 1
			if (recipes[0]) total = Math.ceil(recipes[0].total / limit)
			return res.render('user/index', { recipes, filter, page, total })
		}
		catch (err) {
			throw (err)
		}
	},
	async show(req, res) {
		try {
			const results = await Recipe.find(req.params.id)
			const recipe = results.rows[0]
			return res.render('user/show', { recipe })
		}
		catch (err) {
			throw (err)
		}
	}
}