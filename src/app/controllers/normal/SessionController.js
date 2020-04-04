const crypto = require('crypto')
const { hash } = require('bcryptjs')

const mailer = require('../../../lib/mailer')
const User = require('../../../models/User')
const { showMessage } = require('../../../lib/utils')

module.exports = {
	loginForm(req, res) {
		return res.render("normal/session/login", {
			error: showMessage(req.query.mes)
		})
	},
	login(req, res) {
		const { user } = req

		req.session.userId = user.id
		if (user.is_admin)
			req.session.admin = user.is_admin

		return res.render("admin/users/edit", {
			user,
			error: req.query.mes
		})
	},
	logout(req, res) {
		req.session.destroy()
		return res.redirect("/")
	},
	forgotForm(req, res) {
		return res.render("normal/session/forgot-password")
	},
	async forgot(req, res) {
		try {
			const { user } = req
			//criar um token
			const token = crypto.randomBytes(20).toString("hex")
			//envia token db
			let now = new Date()
			now = now.setHours(now.getHours() + 1)

			await User.update(user.id, {
				reset_token: token,
				reset_token_expires: now
			})
			//enviar um email
			mailer.sendMail({
				to: user.email,
				from: "no-reply@foodfy.com.br",
				subject: "Token de acesso Foodfy",
				html: `<h2>Acesse o link abaixo para recuperar sua senha Foodfy:</h2>
					<a href="localhost:3000/session/password-reset?token=${token}">Recuperar senha</a>
					<p>Caso você não tenha solicitado o reset de senha, desconsidere este email.</p>`
			})

			return res.redirect("/login")
		}
		catch (err) {
			return res.render("normal/session/forgot-password", {
				user: req.body,
				error: "Erro ao realizar solicitação."
			})
		}
	},
	resetForm(req, res) {
		return res.render("normal/session/password-reset", { token: req.query.token })
	},
	async reset(req, res) {
		try {
			const { user } = req
			const newPassword = await hash(req.body.password, 8)

			await User.update(user.id, {
				password: newPassword,
				reset_token: null,
				reset_token_expires: null,
			})

			return res.redirect("/login")
		}
		catch (err) {
			return res.render("normal/session/password-reset", {
				user: req.body,
				token: req.body.token,
				error: "Erro ao realizar solicitação."
			})
		}
	},
	firstLoginForm(req, res) {
		return res.render("normal/session/first-login", {
			token: req.query.token,
			email: req.query.email
		})
	},
	async firstLogin(req, res) {
		try {
			const { user } = req
			const newPassword = await hash(req.body.password, 8)

			await User.update(user.id, {
				password: newPassword,
				reset_token: null,
				reset_token_expires: null,
			})

			return res.redirect("/session/login?suc=pu")
		}
		catch (err) {
			return res.render("normal/session/first-login", {
				user: req.body,
				error: "Erro ao realizar solicitação."
			})
		}
	},
}