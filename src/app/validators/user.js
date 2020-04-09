const User = require('../../models/User')
const { compare } = require('bcryptjs')

module.exports = {
	async post(req, res, next) {
		let { email } = req.body
		// verify if there's another user with the same email
		let user = await User.findOne({
			where: { email }
		})
		if (user) {
			return res.render("admin/users/create", {
				user: req.body,
				error: "Este email já está sendo utilizado!"
			})
		}

		next()
	},
	async put(req, res, next) {
		let { email, password, id } = req.body
		// get the user that's being edit
		const userBeingEdit = await User.findOne({
			where: { id }
		})
		// verify if there's another user with the same email
		results = await User.findOne({
			where: { email }
		})
		if (results && email != userBeingEdit.email) {
			return res.redirect("/session/login?mes=ei")
		}
		// verify the password, if you're changing own account
		if (id == req.session.userId) {
			const passed = await compare(password, userBeingEdit.password)
			if (!passed)
				return res.redirect("/session/login?mes=pi")
		}
		next()
	},
	isOwnerOfAccount(req, res, next) {
		// ignores if is admin
		if (req.session.admin) {
			next()
			return
		}
		// ignores if it's the owner of the account
		else if (req.params.id == req.session.userId || req.body.id == req.session.userId) {
			next()
			return
		}

		return res.redirect("/users/index?mes=ao")
	},
	isDeletingOwnAccount(req, res, next) {
		// check if is deleting own account
		if (req.body.id == req.session.userId)
			return res.redirect("/users/index?mes=dr")

		next()
	},
	async isOwnerOfRecipe(req, res, next) {
		// ignores if is admin
		if (req.session.admin) {
			next()
			return
		}
		// get the recipe and check if it's the owner
		const recipes = await User.getRecipes(req.session.userId)
		const isOwner = recipes.find(elem => elem.id == req.body.id || elem.id == req.params.id)
		//if it's not, redirect
		if (!isOwner)
			return res.redirect(`/admin/recipes?mes=ro`)

		next()
	},
	async canShowEditButton(req, res, next) {
		// ignores if is admin
		if (req.session.admin) {
			next()
			return
		}
		// get the recipe and check if it's the owner
		const recipes = await User.getRecipes(req.session.userId)
		const isOwner = recipes.find(elem => elem.id == req.params.id)

		isOwner ? req.owner = true : req.owner = false

		next()
	},
}