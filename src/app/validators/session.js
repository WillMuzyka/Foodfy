const User = require('../../models/User')
const { compare } = require('bcryptjs')

module.exports = {
	async login(req, res, next) {
		// verify email
		const { email, password } = req.body
		const user = await User.findOne({
			where: { email }
		})

		if (!user)
			return res.render("normal/session/login", {
				user: req.body,
				error: "Usuário não cadastrado"
			})
		// verify password
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
		// verify email
		const { email } = req.body
		const user = await User.findOne({
			where: { email }
		})

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
		// verify email
		const user = await User.findOne({
			where: { email }
		})

		if (!user) {
			return res.render("normal/session/password-reset", {
				user: req.body,
				token,
				error: "Usuário não cadastrado"
			})
		}

		// verify token
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

		// verify password
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
		// find user by email
		const user = await User.findOne({
			where: { email }
		})

		// verify token
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

		// verify password
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
		// verify if there's a session userId
		if (!req.session.userId)
			return res.redirect("/session/login?mes=uo")
		next()
	},
	onlyAdmin(req, res, next) {
		// verify if there's a session admin
		if (!req.session.admin)
			return res.redirect("/admin/recipes?mes=ar")
		next()
	},
	isLogged(req, res, next) {
		// verify if there's a session userId, redirecting if it's true
		if (req.session.userId) {
			let route = "/admin"
			const { mes, suc } = req.query
			if (mes)
				route += `?mes=${mes}`
			else if (suc)
				route += `?suc=${suc}`
			return res.redirect(route)
		}

		next()
	}
}