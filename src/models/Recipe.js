const db = require("../config/db")

module.exports = {
	all() {
		const query = `
			SELECT recipes.*, chefs.name author
			FROM recipes
			LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
			ORDER BY recipes.created_at DESC`
		return db.query(query)
	},
	create(values) {
		const query = `
		INSERT INTO recipes(
			chef_id,
			title,
			ingredients,
			preparation,
			information)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id`

		return db.query(query, values)
	},
	find(id) {
		const query = `
		SELECT recipes.*, chefs.name author
		FROM recipes
		LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
		WHERE recipes.id = $1`

		return db.query(query, [id])
	},
	update(values) {
		const query = `
		UPDATE recipes
		SET 
			chef_id = ($1),
			title = ($2),
			ingredients = ($3),
			preparation = ($4),
			information = ($5)
		WHERE id = $6`

		return db.query(query, values)
	},
	delete(id) {
		const query = `
		DELETE
		FROM recipes
		WHERE id = $1`

		return db.query(query, [id])
	},
	chefOption() {
		const query = `
		SELECT name, id
		FROM chefs
		ORDER BY name`

		return db.query(query)
	},
	paginate(params) {
		const { filter, limit, offset } = params
		let order = "ORDER BY recipes.created_at DESC"
		let filterQuery = ""
		if (filter) {
			filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`
			order = "ORDER BY recipes.updated_at DESC"
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

		return db.query(query)
	}
}