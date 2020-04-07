const db = require("../config/db")
const Base = require('./Base')

Base.init({ table: "recipes" })

module.exports = {
	...Base,
	async all() {
		const query = `
			SELECT recipes.*, chefs.name author
			FROM recipes
			LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
			ORDER BY recipes.created_at DESC`
		const results = await db.query(query)

		return results.rows
	},
	async find(id) {
		const query = `
		SELECT recipes.*, chefs.name author
		FROM recipes
		LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
		WHERE recipes.id = ${id}`

		const results = await db.query(query)
		return results.rows[0]
	},
	async chefOption() {
		const query = `
		SELECT name, id
		FROM chefs
		ORDER BY name`

		const results = await db.query(query)
		return results.rows
	},
	async paginate(params) {
		const { filter, limit, offset, admin, userId } = params
		let order = "ORDER BY recipes.created_at DESC"
		let filterQuery = ""
		if (filter) {
			filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`
			order = "ORDER BY recipes.updated_at DESC"
		}

		if (!admin) {
			if (filter)
				filterQuery = `${filterQuery} AND recipes.user_id = ${userId}`
			else
				filterQuery = `WHERE recipes.user_id = ${userId}`
		}

		const totalQuery = `(
			SELECT count(*)
			FROM recipes
			${filterQuery}
		) total`

		const query = `SELECT recipes.*, ${totalQuery}, chefs.name author
		FROM recipes
		LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
		${filterQuery}
		${order} LIMIT ${limit} OFFSET ${offset}`

		const results = await db.query(query)
		return results.rows
	}
}