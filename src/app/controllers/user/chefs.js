const Chef = require("../../../models/Chef")

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

	}
}