const { unlinkSync } = require('fs')

const Recipe = require("../../../models/Recipe")
const File = require("../../../models/File")
const RecipeFile = require("../../../models/RecipeFile")

const { showMessage } = require("../../../lib/utils")
const exceptionImages = require("../exceptionImages.json")

addSrcFromPath = (files, req) => {
	return files.map(file => ({
		...file,
		src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
	}))
}

module.exports = {
	home(req, res) {
		let route = "/admin/recipes"
		const { mes, suc } = req.query
		if (mes)
			route += `?mes=${mes}`
		else if (suc)
			route += `?suc=${suc}`
		return res.redirect(route)
	},
	async index(req, res) {
		try {
			let { filter, page, limit } = req.query
			page = page || 1
			limit = limit || 6
			const offset = limit * (page - 1)

			let { admin, userId } = req.session
			if (!admin)
				admin = false

			let recipes = await Recipe.paginate({
				filter,
				limit,
				offset,
				admin,
				userId
			})

			const recipesFilePromises = recipes.map(recipe => {
				return RecipeFile.findAll(recipe.id)
			})
			const files = await Promise.all(recipesFilePromises)

			recipes = recipes.map((recipe, index) => ({
				...recipe,
				src: `${files[index][0].path.replace("public", "")}`
			}))

			let total = 1
			if (recipes[0]) total = Math.ceil(recipes[0].total / limit)
			return res.render('admin/recipes/index', {
				recipes,
				filter,
				page,
				total,
				limit,
				error: showMessage(req.query.mes),
				success: showMessage(req.query.suc),
			})
		}
		catch (err) {
			console.error(err)
			return res.redirect("/?mes=pg")
		}
	},
	async create(req, res) {
		try {
			const chefs = await Recipe.chefOption()

			return res.render("admin/recipes/create", { chefs })
		}
		catch (err) {
			console.error(err)
			return res.redirect("admin/recipes?mes=pg")
		}
	},
	async post(req, res) {
		try {
			if (req.files.length == 0) return res.send("Envie uma foto no mínimo!")
			let { chef_id, title, ingredients, preparation, information } = req.body
			ingredients = ingredients.filter(ingredient => ingredient != "")
			preparation = preparation.filter(step => step != "")
			information = information.replace(/\r/g, "")
			//create the recipe
			const recipe_id = await Recipe.create({
				chef_id,
				user_id: req.session.userId,
				title,
				ingredients,
				preparation,
				information
			})

			//create the files
			const filePromises = req.files.map(file => {
				const fileValues = {
					name: file.filename,
					path: file.path
				}
				return File.create(fileValues)
			})
			//get the files id
			const fileReturn = await Promise.all(filePromises)
			const files_id = fileReturn.sort()

			//create the relation between recipes and files
			const recipeFilePromises = files_id.map(id => {
				const recipeFileValues = {
					recipe_id,
					file_id: id
				}
				return RecipeFile.create(recipeFileValues)
			})
			await Promise.all(recipeFilePromises)

			return res.redirect(`/admin/recipes/${recipe_id}?suc=rc`)
		}
		catch (err) {
			console.error(err)
			return res.render("admin/users/create", {
				user: req.body,
				error: "Erro ao criar receita. Por favor tente novamente."
			})
		}

	},
	async show(req, res) {
		try {
			const recipe = await Recipe.find(req.params.id)

			let files = await RecipeFile.findAll(recipe.id)

			files = addSrcFromPath(files, req)

			return res.render('admin/recipes/show', {
				recipe,
				files,
				owner: req.owner,
				error: showMessage(req.query.mes),
				success: showMessage(req.query.suc),
			})
		}
		catch (err) {
			console.error(err)
			return res.redirect("/admin/recipes?mes=pg")
		}
	},
	async edit(req, res) {
		try {
			const recipe = await Recipe.find(req.params.id)

			let images = await RecipeFile.findAll(recipe.id)
			images = addSrcFromPath(images, req)

			const chefs = await Recipe.chefOption()

			return res.render("admin/recipes/edit", {
				recipe,
				images,
				chefs,
				error: showMessage(req.query.mes)
			})
		}
		catch (err) {
			console.error(err)
			return res.redirect("/admin/recipes?mes=pg")
		}
	},
	async put(req, res) {
		try {
			let { removed_ids, chef_id, title,
				ingredients, preparation, information, id } = req.body

			ingredients = ingredients.filter(ingredient => ingredient != "")
			preparation = preparation.filter(step => step != "")
			information = information.replace(/\r/g, "")
			//update the recipe
			await Recipe.update(id, {
				chef_id,
				title,
				ingredients,
				preparation,
				information
			})
			//create new files, if there are any
			if (req.files && req.files.length > 0) {
				const filePromises = req.files.map(file => {
					return File.create({
						name: file.filename,
						path: file.path
					})
				})
				results = await Promise.all(filePromises)

				//get the files id
				const fileReturn = results
				const files_id = fileReturn.sort()

				//create the relation between recipes and files
				const recipeFilePromises = files_id.map(file_id => {
					return RecipeFile.create({
						recipe_id: id,
						file_id
					})
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

			return res.redirect(`/admin/recipes/${id}?suc=ru`)
		}
		catch (err) {
			console.error(err)
			return res.redirect("/admin/recipes?mes=ue")
		}
	},
	async delete(req, res) {
		try {
			const files = await RecipeFile.findAll(req.body.id)

			await Recipe.delete(req.body.id)

			const filesPromises = files.map(file => File.delete(file.id))
			await Promise.all(filesPromises)

			files.map(file => {
				if (!exceptionImages.images.includes(file.path))
					unlinkSync(file.path)
			})

			return res.redirect("/admin/recipes?suc=rd")
		}
		catch (err) {
			console.error(err)
			return res.redirect("/admin/recipes?mes=de")
		}
	}
}