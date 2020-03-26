const db = require("../config/db")

module.exports = {
	all() {
		const query = `
			SELECT recipes.*, chefs.name author
			FROM recipes
			LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
			ORDER BY id`
		return db.query(query)
	},
	create(values) {
		const query = `
		INSERT INTO recipes(
			chef_id,
			title,
			ingredients,
			preparation,
			information,
			created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
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
		let filterQuery = ""
		if (filter) filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`

		const totalQuery = `(
			SELECT count(*)
			FROM recipes
			${filterQuery}
		) total`

		const query = `SELECT recipes.*, ${totalQuery}, chefs.name author
		FROM recipes
		LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
		${filterQuery}
		ORDER BY id LIMIT ${limit} OFFSET ${offset}`

		return db.query(query)
	}
}