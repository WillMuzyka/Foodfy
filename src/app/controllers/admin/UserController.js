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

			let results = await User.paginate(params)
			let users = results.rows
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
			values = [
				name,
				email,
				password,
				is_admin
			]

			results = await User.create(values)
			const userId = results.rows[0].id

			//envia token db
			let now = new Date()
			now = now.setHours(now.getHours() + 1)

			await User.update(userId, {
				reset_token: token,
				reset_token_expires: now
			})

			return res.redirect("/users/index?suc=uc")
		}
		catch{
			console.error(err)
			return res.render("admin/users/edit", {
				error: "Erro ao criar usuário. Por favor tente novamente."
			})
		}
	},
	async edit(req, res) {
		try {
			let results = await User.find({ where: { id: req.params.id } })
			const user = results.rows[0]

			return res.render("admin/users/edit", {
				user,
				error: req.query.mes
			})
		}
		catch{
			console.error(err)
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
			return res.render("admin/users/create", {
				success: "Conta deletada com sucesso!"
			})
		}
		catch (err) {
			console.error(err)
			return res.render("admin/users/create", {
				user: req.body,
				error: "Erro ao deletar o usuário. Por favor tente novamente."
			})
		}
	},

}