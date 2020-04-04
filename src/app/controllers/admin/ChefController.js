const Chef = require("../../../models/Chef")
const File = require("../../../models/File")
const RecipeFile = require("../../../models/RecipeFile")
const { showDate, showMessage } = require("../../../lib/utils")

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

addSrcFromPath = (files, req) => {
	return files.map(file => ({
		...file,
		src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
	}))
}

module.exports = {
	async index(req, res) {
		try {
			let { filter, page, limit } = req.query
			page = page || 1
			limit = limit || 12
			const offset = limit * (page - 1)

			const params = {
				filter,
				limit,
				offset
			}

			const results = await Chef.paginate(params)
			let chefs = results.rows

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
		catch (err) {
			console.log("Erro ao carregar chefs index")
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

			const fileValues = [
				avatar.filename,
				avatar.path
			]
			let results = await File.create(fileValues)
			const file_id = results.rows[0].id

			const values = [
				req.body.name,
				file_id
			]

			results = await Chef.create(values)
			const id = results.rows[0].id
			return res.redirect(`/admin/chefs/${id}`)
		}
		catch (err) {
			console.log("Erro ao postar chef")
			return res.render("admin/chefs/create", {
				error: "Erro ao criar chef. Por favor, tente novamente."
			})
		}
	},
	async show(req, res) {
		try {
			let results = await Chef.find(req.params.id)
			if (results.rows[0]) {
				let chef = results.rows[0]
				chef = {
					...chef,
					src: `${req.protocol}://${req.headers.host}${chef.path.replace("public", "")}`
				}

				results = await Chef.recipesPublished(chef.id)
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

				return res.render('admin/chefs/show', {
					chef,
					recipes,
					error: showMessage(req.query.mes),
					success: showMessage(req.query.suc),
				})
			}
		}
		catch (err) {
			console.log("Erro ao exibir chef", err)
			return res.redirect("/admin/chefs?mes=pg")
		}
	},
	async edit(req, res) {
		try {
			let results = await Chef.find(req.params.id)
			if (results.rows[0]) {
				const chef = results.rows[0]
				results = await File.find(chef.file_id)

				const file = results.rows[0]
				return res.render('admin/chefs/edit', {
					chef,
					file,
					error: showMessage(req.query.mes),
					success: showMessage(req.query.suc),
				})

			}
			return res.redirect('/admin/chefs?mes=pg')
		}
		catch (err) {
			console.log("Erro ao exibir chef para edição")
			return res.redirect("/admin/chefs?mes=pg")
		}
	},
	async put(req, res) {
		try {
			let results = await Chef.find(req.body.id)
			let old_file = null
			let file_id = results.rows[0].file_id

			const avatar = req.file
			if (avatar) {
				old_file = file_id

				const fileValues = [
					avatar.filename,
					avatar.path
				]

				results = await File.create(fileValues)
				file_id = results.rows[0].id
			}

			const values = [
				req.body.name,
				file_id,
				req.body.id
			]

			await Chef.update(values)
			if (old_file) await File.delete(old_file)
			return res.redirect(`/admin/chefs/${req.body.id}?suc=cu`)
		}
		catch (err) {
			console.log("Erro ao atualizar chef")
			return res.redirect("/admin/chefs?mes=ue")
		}
	},
	async delete(req, res) {
		try {
			let results = await Chef.find(req.body.id)

			await Chef.delete(req.body.id)

			let file_id = results.rows[0].file_id
			await File.delete(file_id)

			return res.redirect("/admin/chefs?suc=cd")
		}
		catch (err) {
			console.log("Erro ao deletar chef")
			return res.redirect("/admin/chefs?mes=de")
		}
	}
}