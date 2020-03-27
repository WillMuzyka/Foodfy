const db = require("../config/db")

module.exports = {
	all(callback) {
		const query = `
		SELECT chefs.*, files.path, count(recipes.*) total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		JOIN files ON (files.id = chefs.file_id)
		GROUP BY files.path, chefs.id
		ORDER BY chefs.id`
		db.query(query, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback(results.rows)
		})
	},
	create(values) {
		const query = `
		INSERT INTO chefs(
			name,
			file_id)
		VALUES ($1, $2)
		RETURNING id`

		return db.query(query, values)
	},
	find(id) {
		const query = `
		SELECT chefs.*, files.path, count(recipes.*) total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		JOIN files ON (files.id = chefs.file_id)
		WHERE chefs.id = $1
		GROUP BY files.path, chefs.id
		ORDER BY chefs.id`

		return db.query(query, [id])
	},
	update(values) {
		const query = `
		UPDATE chefs
		SET 
			name = ($1),
			file_id = ($2)
		WHERE id = $3`

		return db.query(query, values)
	},
	delete(id) {
		const query = `
		DELETE
		FROM chefs
		WHERE id = $1`

		return db.query(query, [id])
	},
	recipesPublished(id) {
		const query = `SELECT *
		FROM recipes
		WHERE chef_id = $1
		ORDER BY recipes.created_at`

		return db.query(query, [id])
	},
	paginate(params) {
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

		return db.query(query)
	}
}