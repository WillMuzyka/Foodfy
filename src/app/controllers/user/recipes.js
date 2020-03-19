const Recipe = require("../../../models/Recipe")
const aboutText = require("../../about")

module.exports = {
	home(req, res) {
		Recipe.all(recipes => res.render('user/home', { recipes }))
	},
	about(req, res) {
		return res.render('user/about', { aboutText })
	},
	index(req, res) {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 9
		const offset = limit * (page - 1)

		const params = {
			filter,
			limit,
			offset
		}

		Recipe.paginate(params, recipes => {
			let total = 1
			if (recipes[0]) total = Math.ceil(recipes[0].total / limit)
			res.render('user/index', { recipes, filter, page, total })
		})
	},
	show(req, res) {
		Recipe.find(req.params.id, recipe => {
			res.render('user/show', { recipe })
		})
	}
}