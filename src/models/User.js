const db = require("../config/db")

module.exports = {
	all() {
		return db.query(`SELECT users.id, users.name, users.email FROM users`)
	},
	find(fields) {
		let query = "SELECT * FROM users"
		Object.keys(fields).map(key => {
			query = `${query} 
				${key}`
			Object.keys(fields[key]).map(field => {
				query = `${query} ${field} = '${fields[key][field]}'`
			})
		})

		return db.query(query)
	},
	create(values) {
		const query = `INSERT INTO users (
			name,
			email,
			password,
			is_admin
		) VALUES ($1, $2, $3, $4)
		RETURNING id`

		return db.query(query, values)
	},
	update(id, values) {
		let query = "UPDATE users SET"
		Object.keys(values).map((key, index, array) => {
			if (values[key]) {
				query = `${query} 
					${key} = '${values[key]}'`
			} else {
				query = `${query} 
					${key} = NULL`
			}
			if (index + 1 < array.length)
				query = `${query},`
			else
				query = `${query} WHERE id = ${id}`
		})

		return db.query(query)
	},
	delete(id) {
		return db.query(`DELETE FROM users WHERE id = ${id}`)
	},
	paginate(params) {
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

		return db.query(query)
	},
	getRecipes(id) {
		return db.query(`SELECT recipes.id FROM recipes WHERE user_id = ${id}`)
	}
}