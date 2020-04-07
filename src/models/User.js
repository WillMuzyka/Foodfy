const db = require("../config/db")
const Base = require('./Base')

Base.init({ table: "users" })

module.exports = {
	...Base,
	async all() {
		const results = await db.query(`SELECT users.id, users.name, users.email FROM users`)
		return results.rows
	},
	async paginate(params) {
		const { filter, limit, offset } = params
		let order = "ORDER BY users.created_at DESC"
		let filterQuery = ""
		if (filter) {
			filterQuery = `
				WHERE users.name ILIKE '%${filter}%'
				OR users.email ILIKE '%${filter}%'`
			order = "ORDER BY users.updated_at DESC"
		}

		const totalQuery = `(
			SELECT count(*)
			FROM users
			${filterQuery}
		) total`

		const query = `SELECT *, ${totalQuery}
		FROM users
		${filterQuery}
		${order} LIMIT ${limit} OFFSET ${offset}`

		const results = await db.query(query)
		return results.rows
	},
	async getRecipes(id) {
		const results = await db.query(`SELECT recipes.id FROM recipes WHERE user_id = ${id}`)
		return results.rows
	}
}