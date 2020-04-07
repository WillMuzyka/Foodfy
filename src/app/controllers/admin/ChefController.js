const { unlinkSync } = require('fs')

const Chef = require("../../../models/Chef")
const File = require("../../../models/File")
const Recipe = require("../../../models/Recipe")
const RecipeFile = require("../../../models/RecipeFile")

const { showDate, showMessage } = require("../../../lib/utils")
const exceptionImages = require("../exceptionImages.json")


addSrcFromPath = (files) => {
	return files.map(file => ({
		...file,
		src: `${file.path.replace("public", "")}`
	}))
}

module.exports = {
	async index(req, res) {
		try {
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
				src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
			}))

			let total = 1
			if (chefs[0]) total = Math.ceil(chefs[0].total / limit)
			return res.render('admin/chefs/index', {
				chefs,
				filter,
				page,
				total,
				limit,
				error: showMessage(req.query.mes),
				success: showMessage(req.query.suc),
			})
		}
		catch (error) {
			console.error(error)
			return res.redirect('/admin/recipes?mes=pg')
		}
	},
	create(req, res) {
		return res.render("admin/chefs/create")
	},
	async post(req, res) {
		try {
			if (req.file.length == 0) return res.send("Envie uma foto de avatar!")
			const avatar = req.file

			const file_id = await File.create({
				name: avatar.filename,
				path: avatar.path
			})

			const id = await Chef.create({
				name: req.body.name,
				file_id
			})

			return res.redirect(`/admin/chefs/${id}?suc=uc`)
		}
		catch (error) {
			console.error(error)
			return res.render("admin/chefs/create", {
				error: "Erro ao criar chef. Por favor, tente novamente."
			})
		}
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

				return res.render('admin/chefs/show', {
					chef,
					recipes,
					error: showMessage(req.query.mes),
					success: showMessage(req.query.suc),
				})
			}
		}
		catch (error) {
			console.error(error)
			return res.redirect("/admin/chefs?mes=pg")
		}
	},
	async edit(req, res) {
		try {
			let chef = await Chef.find(req.params.id)
			if (chef) {
				const file = await File.find(chef.file_id)

				return res.render('admin/chefs/edit', {
					chef,
					file,
					error: showMessage(req.query.mes),
					success: showMessage(req.query.suc),
				})

			}
			return res.redirect('/admin/chefs?mes=pg')
		}
		catch (error) {
			console.error(error)
			return res.redirect("/admin/chefs?mes=pg")
		}
	},
	async put(req, res) {
		try {
			let chef = await Chef.find(req.body.id)
			let old_file = null
			let file_id = chef.file_id

			const avatar = req.file
			if (avatar) {
				old_file = file_id

				file_id = await File.create({
					name: avatar.filename,
					path: avatar.path
				})
			}

			await Chef.update(req.body.id, {
				name: req.body.name,
				file_id,
			})
			if (old_file) await File.delete(old_file)

			return res.redirect(`/admin/chefs/${req.body.id}?suc=cu`)
		}
		catch (error) {
			console.error(error)
			return res.redirect("/admin/chefs?mes=ue")
		}
	},
	async delete(req, res) {
		try {
			//get chef id, chef data and chef's recipes and these recipes files
			const { id } = req.body
			const chef = await Chef.find(id)
			const recipes = await Recipe.findAll({ where: { chef_id: id } })
			const recipeFilesPromise = recipes.map(recipe => RecipeFile.findAll(recipe.id))
			const recipeFiles = await Promise.all(recipeFilesPromise)
			//delete chef
			await Chef.delete(id)
			//delete chef avatar
			await File.delete(chef.file_id)
			if (!exceptionImages.images.includes(chef.path))
				unlinkSync(chef.path)
			//delete chef's recipes
			const deletePromise = recipeFiles.map(files => {
				files.map(file => {
					File.delete(file.id)
					if (!exceptionImages.images.includes(file.path))
						unlinkSync(file.path)
				})
			})
			await Promise.all(deletePromise)

			return res.redirect("/admin/chefs?suc=cd")
		}
		catch (error) {
			console.error(error)
			return res.redirect("/admin/chefs?mes=de")
		}
	}
}