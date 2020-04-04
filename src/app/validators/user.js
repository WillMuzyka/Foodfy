const User = require('../../models/User')

module.exports = {
	async post(req, res, next) {
		let { email } = req.body
		//verificar se é admin -> não implementado no momento
		//verificar se já existe usuário com mesmo email
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