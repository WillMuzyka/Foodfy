const db = require("../config/db")
const Base = require('./Base')

Base.init({ table: "chefs" })

module.exports = {
	...Base,
	async all() {
		const query = `
		SELECT chefs.*, files.path, count(recipes.*) total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		JOIN files ON (files.id = chefs.file_id)
		GROUP BY files.path, chefs.id
		ORDER BY chefs.id`
		const results = db.query(query)
		return results.rows
	},
	async find(id) {
		const query = `
		SELECT chefs.*, files.path, count(recipes.*) total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		JOIN files ON (files.id = chefs.file_id)
		WHERE chefs.id = ${id}
		GROUP BY files.path, chefs.id
		ORDER BY chefs.id`

		const results = await db.query(query)
		return results.rows[0]
	},
	async paginate(params) {
		const { filter, limit, offset } = params
		let filterQuery = ""
		if (filter) filterQuery = `WHERE chefs.name ILIKE '%${filter}%'`

		const totalQuery = `(
			SELECT count(*)
			FROM chefs
			${filterQuery}
		) total`

		const query = `
		SELECT chefs.*, files.path, ${totalQuery}, count(recipes.*) total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		JOIN files ON (files.id = chefs.file_id)
		${filterQuery}
		GROUP BY chefs.id, files.path
		ORDER BY id LIMIT ${limit} OFFSET ${offset}`

		const results = await db.query(query)
		return results.rows
	}
}