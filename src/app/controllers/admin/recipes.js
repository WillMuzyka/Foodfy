const Recipe = require("../../../models/Recipe")
const { showDate } = require("../../../lib/utils")

duplicateRecipe = (recipe) => {
	const values = [
		1,
		recipe.image,
		recipe.title,
		recipe.ingredients.filter(ingredient => ingredient != ""),
		recipe.preparation.filter(step => step != ""),
		recipe.information.replace(/\r/g, ""),
		showDate(Date.now()).iso
	]
	Recipe.create(values, () => {
		return console.log(recipe.title + " added!")
	})
}

module.exports = {
	home(req, res) {
		return res.redirect("/admin/recipes")
	},
	index: (req, res) => {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 6
		const offset = limit * (page - 1)

		const params = {
			filter,
			limit,
			offset
		}

		Recipe.paginate(params, recipes => {
			let total = 1
			if (recipes[0]) total = Math.ceil(recipes[0].total / limit)
			res.render('admin/recipes/index', { recipes, filter, page, total })
		})
	},
	create: (req, res) => {
		Recipe.chefOption(chefs => {
			return res.render("admin/recipes/create", { chefs })
		})
	},
	post: (req, res) => {
		const values = [
			req.body.chef_id,
			req.body.image,
			req.body.title,
			req.body.ingredients.filter(ingredient => ingredient != ""),
			req.body.preparation.filter(step => step != ""),
			req.body.information.replace(/\r/g, ""),
			showDate(Date.now()).iso
		]

		Recipe.create(values, () => {
			return res.redirect("/admin/recipes")
		})
	},
	show: (req, res) => {
		Recipe.find(req.params.id, recipe => {
			res.render('admin/recipes/show', { recipe })
		})
	},
	edit: (req, res) => {
		Recipe.find(req.params.id, recipe => {
			Recipe.chefOption(chefs => {
				return res.render("admin/recipes/edit", { recipe, chefs })
			})
		})
	},
	put: (req, res) => {
		const values = [
			req.body.chef_id,
			req.body.image,
			req.body.title,
			req.body.ingredients.filter(ingredient => ingredient != ""),
			req.body.preparation.filter(step => step != ""),
			req.body.information.replace(/\r/g, ""),
			req.body.id
		]

		Recipe.update(values, () => {
			return res.redirect("/admin/recipes")
		})
	},
	delete: (req, res) => {
		Recipe.delete(req.body.id, () => res.redirect("/admin/recipes"))
	}
}