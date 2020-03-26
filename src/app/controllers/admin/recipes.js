const Recipe = require("../../../models/Recipe")
const File = require("../../../models/File")
const RecipeFile = require("../../../models/RecipeFile")

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

addSrcFromPath = (files, req) => {
	return files.map(file => ({
		...file,
		src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
	}))
}

module.exports = {
	home(req, res) {
		return res.redirect("/admin/recipes")
	},
	async index(req, res) {
		let { filter, page, limit } = req.query
		page = page || 1
		limit = limit || 6
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
		return res.render('admin/recipes/index', { recipes, filter, page, total })
	},
	async create(req, res) {
		const results = await Recipe.chefOption()
		const chefs = results.rows

		return res.render("admin/recipes/create", { chefs })
	},
	async post(req, res) {
		if (req.files.length == 0) return res.send("Envie uma foto no mínimo!")
		const values = [
			req.body.chef_id,
			req.body.title,
			req.body.ingredients.filter(ingredient => ingredient != ""),
			req.body.preparation.filter(step => step != ""),
			req.body.information.replace(/\r/g, "")
		]

		//create the files
		const filePromises = req.files.map(file => {
			const fileValues = [
				file.filename,
				file.path
			]
			return File.create(fileValues)
		})
		let results = await Promise.all(filePromises)

		//get the files id
		const fileReturn = results
		const files_id = fileReturn.map(file => file.rows[0].id).sort()

		//create the recipe
		results = await Recipe.create(values)
		const recipe_id = results.rows[0].id

		//create the relation between recipes and files
		const recipeFilePromises = files_id.map(id => {
			const recipeFileValues = [
				recipe_id,
				id
			]
			return RecipeFile.create(recipeFileValues)
		})
		await Promise.all(recipeFilePromises)


		return res.redirect(`/admin/recipes/${recipe_id}`)

	},
	async show(req, res) {
		let results = await Recipe.find(req.params.id)
		const recipe = results.rows[0]

		results = await RecipeFile.find(recipe.id)
		let files = results.rows

		files = addSrcFromPath(files, req)

		return res.render('admin/recipes/show', { recipe, files })
	},
	async edit(req, res) {
		let results = await Recipe.find(req.params.id)
		const recipe = results.rows[0]

		results = await RecipeFile.find(recipe.id)
		let images = results.rows
		images = addSrcFromPath(images, req)

		results = await Recipe.chefOption()
		const chefs = results.rows

		return res.render("admin/recipes/edit", { recipe, images, chefs })
	},
	async put(req, res) {
		const { id: recipe_id, removed_ids } = req.body

		const values = [
			req.body.chef_id,
			req.body.title,
			req.body.ingredients.filter(ingredient => ingredient != ""),
			req.body.preparation.filter(step => step != ""),
			req.body.information.replace(/\r/g, ""),
			recipe_id
		]

		//update the recipe
		let results = await Recipe.update(values)

		//create new files, if there are any
		if (req.files && req.files.length > 0) {
			const filePromises = req.files.map(file => {
				const fileValues = [
					file.filename,
					file.path
				]
				return File.create(fileValues)
			})
			results = await Promise.all(filePromises)

			//get the files id
			const fileReturn = results
			const files_id = fileReturn.map(file => file.rows[0].id).sort()

			//create the relation between recipes and files
			const recipeFilePromises = files_id.map(id => {
				const recipeFileValues = [
					recipe_id,
					id
				]
				return RecipeFile.create(recipeFileValues)
			})
			await Promise.all(recipeFilePromises)
		}

		//delete the files, if there are any to delete
		if (removed_ids) {
			let removedIdArray = req.body.removed_ids.split(",")
			removedIdArray.splice(-1, 1)
			removedIdArray = removedIdArray.map(id => Number(id))

			//delete first the recipe_files line, because of FK
			const recipeFilesPromises = removedIdArray.map(id => RecipeFile.delete(id))
			await Promise.all(recipeFilesPromises)

			//delete the files
			const filesPromises = removedIdArray.map(id => File.delete(id))
			await Promise.all(filesPromises)
		}

		return res.redirect(`/admin/recipes/${recipe_id}`)
	},
	async delete(req, res) {
		let results = await RecipeFile.find(req.body.id)
		const files = results.rows

		const recipeFilesPromises = files.map(row => RecipeFile.delete(row.id))
		await Promise.all(recipeFilesPromises)

		const filesPromises = files.map(row => File.delete(row.id))
		await Promise.all(filesPromises)

		await Recipe.delete(req.body.id)
		return res.redirect("/admin/recipes")
	}
}