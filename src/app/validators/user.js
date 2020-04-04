const User = require('../../models/User')
const { compare } = require('bcryptjs')

module.exports = {
	async post(req, res, next) {
		let { email } = req.body
		//verify if there's another user with the same email
		let results = await User.find({
			where: { email }
		})
		if (results.rows[0]) {
			return res.render("admin/users/create", {
				user: req.body,
				error: "Este email já está sendo utilizado!"
			})
		}
		next()
	},
	async put(req, res, next) {
		let { email, password, id } = req.body
		//get the user that's being edit
		let results = await User.find({
			where: { id }
		})
		const userBeingEdit = results.rows[0]
		//verify if there's another user with the same email
		results = await User.find({
			where: { email }
		})
		if (results.rows[0] && email != userBeingEdit.email) {
			return res.render("admin/users/create", {
				user: req.body,
				error: "Este email já está sendo utilizado!"
			})
		}
		//verify the password, if you're changing own account
		if (id == req.session.userId) {
			const passed = await compare(password, userBeingEdit.password)
			if (!passed)
				return res.render("normal/session/login", {
					user: req.body,
					error: "Senha incorreta"
				})
		}
		next()
	},
	isOwnerOfAccount(req, res, next) {
		if (req.session.admin) {
			next()
			return
		}
		else if (req.params.id == req.session.userId || req.body.id == req.session.userId) {
			next()
			return
		}

		return res.redirect("/users/index?mes=ao")
	},
	isDeletingOwnAccount(req, res, next) {
		if (req.body.id == req.session.userId)
			return res.redirect("/users/index?mes=dr")

		next()
	},
	async isOwnerOfRecipe(req, res, next) {
		if (req.session.admin) {
			next()
			return
		}

		const results = await User.getRecipes(req.session.userId)
		const recipes = results.rows
		const isOwner = recipes.find(elem => elem.id == req.body.id || elem.id == req.params.id)

		if (!isOwner)
			return res.redirect(`/admin/recipes?mes=ro`)

		next()
	},
	async canShowEditButton(req, res, next) {
		if (req.session.admin) {
			next()
			return
		}

		const results = await User.getRecipes(req.session.userId)
		const recipes = results.rows
		const isOwner = recipes.find(elem => elem.id == req.params.id)

		isOwner ? req.owner = true : req.owner = false

		next()
	},
}