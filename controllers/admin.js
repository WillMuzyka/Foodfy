const fs = require('fs')
const data = require("../src/data.json")
const recipes = data.recipes

module.exports = {
	home: (req, res) => {
		return res.redirect('admin/recipes')
	},
	index: (req, res) => {
		return res.render('admin/index', { recipes })
	},
	create: (req, res) => {
		return res.render("admin/create")
	},
	post: (req, res) => {
		let { image, title, author, ingredients, preparation, information } = req.body
		id = Number(recipes[recipes.length - 1].id + 1)
		information = information.replace(/\r/g, "")
		ingredients = ingredients.filter(ingredient => ingredient != "")
		preparation = preparation.filter(step => step != "")
		const recipe = {
			id,
			image,
			title,
			author,
			ingredients,
			preparation,
			information
		}

		data.recipes.push(recipe)
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			if (err) return res.send(err)
			return res.redirect(`/admin/recipes/${id}`)
		})
	},
	show: (req, res) => {
		const { id } = req.params
		const recipe = recipes.find(recipe => recipe.id == id)
		return res.render('admin/show', { recipe })
	},
	edit: (req, res) => {
		const { id } = req.params
		const recipe = recipes.find(recipe => recipe.id == id)
		return res.render('admin/edit', { recipe })
	},
	put: (req, res) => {
		let { id, information, ingredients, preparation } = req.body
		const index = recipes.findIndex(recipe => recipe.id == id)
		id = Number(id)
		information = information.replace(/\r/g, "")
		ingredients = ingredients.filter(ingredient => ingredient != "")
		preparation = preparation.filter(step => step != "")

		const recipe = {
			...recipes[index],
			...req.body,
			information,
			id,
			ingredients,
			preparation,
		}


		data.recipes[index] = recipe
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			if (err) return res.send(err)
			return res.redirect(`/admin/recipes/${id}`)
		})
	},
	delete: (req, res) => {
		let { id } = req.body
		const newRecipes = recipes.filter(recipe => recipe.id != id)

		data.recipes = newRecipes
		fs.writeFile("src/data.json", JSON.stringify(data, null, 2), (err) => {
			if (err) return res.send(err)
			return res.redirect("/admin/recipes")
		})
	}
}