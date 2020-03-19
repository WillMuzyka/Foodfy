const Chef = require("../../../models/Chef")

module.exports = {
	index(req, res) {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 16
		const offset = limit * (page - 1)

		const params = {
			filter,
			limit,
			offset
		}
		Chef.paginate(params, chefs => {
			let total = 1
			if (chefs[0]) total = Math.ceil(chefs[0].total / limit)
			res.render('user/chefs', { chefs, filter, page, total })
		})
	}
}