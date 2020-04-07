const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../../lib/mailer')

const User = require('../../../models/User')
const { showMessage } = require('../../../lib/utils')

module.exports = {
	async index(req, res) {
		try {
			let { filter, page, limit } = req.query
			page = page || 1
			limit = limit || 9
			const offset = limit * (page - 1)

			const params = {
				filter,
				limit,
				offset
			}

			let users = await User.paginate(params)
			//ajust the number of users to a multiple of 3 (just for making the visual)
			const modThree = users.length % 3
			if (modThree != 0) {
				for (i = 3; i > modThree; i--) {
					users.push({ nullItem: "null" })
				}
			}

			let total = 1
			if (users[0]) total = Math.ceil(users[0].total / limit)
			return res.render("admin/users/index", {
				users,
				page,
				total,
				filter,
				limit,
				error: showMessage(req.query.mes),
				success: showMessage(req.query.suc),
			})
		}
		catch (err) {
			console.error(err)
		}
	},
	create(req, res) {
		return res.render("admin/users/create")
	},
	async post(req, res) {
		try {
			let { email, name, is_admin } = req.body
			//criar um token
			const token = crypto.randomBytes(20).toString("hex")
			//enviar um email
			mailer.sendMail({
				to: email,
				from: "no-reply@foodfy.com.br",
				subject: "Token de acesso Foodfy",
				html: `<h2>Utilize o link abaixo para acessar sua conta do Foodfy:</h2>
			<a href="localhost:3000/session/first-login?token=${token}&email=${email}">Primeiro acesso</a>
			<p>Utilize este link para acessar sua conta e definir uma nova senha.</p>`
			})
			//cria usuário
			const password = await hash(token, 8)
			is_admin = is_admin ? true : false

			const userId = await User.create({
				name,
				email,
				password,
				is_admin
			})

			//envia token db
			let now = new Date()
			now = now.setHours(now.getHours() + 1)

			await User.update(userId, {
				reset_token: token,
				reset_token_expires: now
			})

			return res.redirect("/users/success")
		}
		catch (error) {
			console.error(error)
			return res.redirect("/users/fail")
		}
	},
	async edit(req, res) {
		try {
			const user = await User.findOne({ where: { id: req.params.id } })

			return res.render("admin/users/edit", {
				user,
				error: req.query.mes
			})
		}
		catch (error) {
			console.error(error)
			return res.render("admin/users/edit", {
				error: "Erro ao carregar usuário. Por favor tente novamente."
			})
		}
	},
	async update(req, res) {
		try {
			let { email, name, is_admin, id } = req.body
			if (req.session.admin)
				is_admin = is_admin ? true : false
			else
				is_admin = false

			await User.update(id, {
				name,
				email,
				is_admin
			})

			return res.render("admin/users/edit", {
				user: req.body,
				success: "Usuário atualizado com sucesso!"
			})
		}
		catch (err) {
			console.error(err)
			return res.render("admin/users/edit", {
				user: req.body,
				error: "Erro ao atualizar usuário. Por favor tente novamente."
			})
		}
	},
	async delete(req, res) {
		try {
			await User.delete(req.body.id)
			return res.redirect("/users/index?suc=ud")
		}
		catch (err) {
			console.error(err)
			return res.render("admin/users/create", {
				user: req.body,
				error: "Erro ao deletar o usuário. Por favor tente novamente."
			})
		}
	},
	success(req, res) {
		return res.render("admin/userMessages/success")
	},
	fail(req, res) {
		return res.render("admin/userMessages/fail")
	}
}