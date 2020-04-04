const User = require('../../models/User')
const { compare } = require('bcryptjs')

module.exports = {
	async login(req, res, next) {
		//verificar email
		const { email, password } = req.body
		let results = await User.find({
			where: { email }
		})
		const user = results.rows[0]
		if (!user)
			return res.render("normal/session/login", {
				user: req.body,
				error: "Usuário não cadastrado"
			})
		//verificar senha
		const passed = await compare(password, user.password)
		if (!passed)
			return res.render("normal/session/login", {
				user: req.body,
				error: "Senha incorreta"
			})

		req.user = user

		next()
	},
	async forgot(req, res, next) {
		//verificar email
		const { email } = req.body
		let results = await User.find({
			where: { email }
		})
		const user = results.rows[0]
		if (!user)
			return res.render("normal/session/forgot-password", {
				user: req.body,
				error: "Usuário não cadastrado"
			})

		req.user = user

		next()
	},
	async reset(req, res, next) {
		let { email, password, passwordRepeat, token } = req.body
		//verificar email
		let results = await User.find({
			where: { email }
		})
		const user = results.rows[0]

		if (!user) {
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "Usuário não cadastrado"
			})
		}

		//verificar token
		if (user.reset_token != token) {
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "Token inválido."
			})
		}

		let now = new Date()
		if (user.reset_token_expires < now) {
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "Token expirado. Solicite uma nova recuperação de senha."
			})
		}

		//verificar senha
		if (password != passwordRepeat)
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "As senhas não batem"
			})

		req.user = user

		next()
	},
	async firstLogin(req, res, next) {
		let { email, password, passwordRepeat, token } = req.body
		//find user by email
		let results = await User.find({
			where: { email }
		})
		const user = results.rows[0]

		//verificar token
		if (user.reset_token != token) {
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "Token inválido."
			})
		}

		let now = new Date()
		if (user.reset_token_expires < now) {
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "Token expirado. Realize login novamente."
			})
		}

		//verificar senha
		if (password != passwordRepeat)
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "As senhas não batem"
			})

		req.user = user

		next()
	},
	onlyUser(req, res, next) {
		if (!req.session.userId)
			return res.redirect("/session/login?mes=uo")
		next()
	},
	onlyAdmin(req, res, next) {
		if (!req.session.admin)
			return res.redirect("/admin/recipes?mes=ar")
		next()
	},
	isLogged(req, res, next) {
		if (req.session.userId)
			return res.redirect("/admin")

		next()
	}
}