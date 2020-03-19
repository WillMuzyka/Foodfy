const Chef = require("../../../models/Chef")
const { showDate } = require("../../../lib/utils")

duplicateChef = (chef) => {
	const values = [
		1,
		chef.image,
		chef.title,
		chef.ingredients.filter(ingredient => ingredient != ""),
		chef.preparation.filter(step => step != ""),
		chef.information.replace(/\r/g, ""),
		showDate(Date.now()).iso
	]
	Chef.create(values, () => {
		return console.log(chef.title + " added!")
	})
}

module.exports = {
	index: (req, res) => {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 12
		const offset = limit * (page - 1)

		const params = {
			filter,
			limit,
			offset
		}
		Chef.paginate(params, chefs => {
			let total = 1
			if (chefs[0]) total = Math.ceil(chefs[0].total / limit)
			res.render('admin/chefs/index', { chefs, filter, page, total })
		})
	},
	create: (req, res) => {
		return res.render("admin/chefs/create")
	},
	post: (req, res) => {
		const values = [
			req.body.name,
			req.body.avatar_url,
			showDate(Date.now()).iso
		]

		Chef.create(values, () => {
			return res.redirect("/admin/chefs")
		})
	},
	show: (req, res) => {
		console.log(`id=${req.params.id}`)
		Chef.find(req.params.id, chef => {
			Chef.recipesPublished(chef.id, recipes => {
				res.render('admin/chefs/show', { chef, recipes })
			})
		})
	},
	edit: (req, res) => {
		Chef.find(req.params.id, chef => {
			res.render('admin/chefs/edit', { chef })
		})
	},
	put: (req, res) => {
		const values = [
			req.body.name,
			req.body.avatar_url,
			req.body.id
		]

		Chef.update(values, () => {
			return res.redirect("/admin/chefs")
		})
	},
	delete: (req, res) => {
		console.log(req.body.id)
		Chef.delete(req.body.id, () => res.redirect("/admin/chefs"))
	}
}