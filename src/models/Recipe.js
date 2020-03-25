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
			image,
			title,
			ingredients,
			preparation,
			information,
			created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id`

		db.query(query, values)
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
			image = ($2),
			title = ($3),
			ingredients = ($4),
			preparation = ($5),
			information = ($6)
		WHERE id = $7`

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