const db = require("../config/db")

module.exports = {
	all(callback) {
		const query = `
		SELECT chefs.*, count(recipes.*) total
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		GROUP BY chefs.id
		ORDER BY id`
		db.query(query, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback(results.rows)
		})
	},
	create(values, callback) {
		const query = `
		INSERT INTO chefs(
			name,
			avatar_url,
			created_at)
		VALUES ($1, $2, $3)
		RETURNING id`

		db.query(query, values, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback()
		})
	},
	find(id, callback) {
		const query = `
		SELECT chefs.*, count(recipes.*) total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		WHERE chefs.id = $1
		GROUP BY chefs.id`

		db.query(query, [id], (err, results) => {
			if (err) throw `Databaerror! ${err}`
			callback(results.rows[0])
		})
	},
	update(values, callback) {
		const query = `
		UPDATE chefs
		SET 
			name = ($1),
			avatar_url = ($2)
		WHERE id = $3`

		db.query(query, values, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback()
		})
	},
	delete(id, callback) {
		const query = `
		DELETE
		FROM chefs
		WHERE id = $1`

		db.query(query, [id], (err, results) => {
			if (err) throw `Databaerror! ${err}`
			callback()
		})
	},
	recipesPublished(id, callback) {
		const query = `SELECT *
		FROM recipes
		WHERE chef_id = $1
		ORDER BY id`

		db.query(query, [id], (err, results) => {
			if (err) throw `Database error! ${err}`
			callback(results.rows)
		})
	},
	paginate(params, callback) {
		const { filter, limit, offset } = params
		let filterQuery = ""
		if (filter) filterQuery = `WHERE chefs.name ILIKE '%${filter}%'`

		const totalQuery = `(
			SELECT count(*)
			FROM chefs
			${filterQuery}
		) total`

		const query = `
		SELECT chefs.*, ${totalQuery}, count(recipes.*) total_recipes
		FROM chefs
		LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
		${filterQuery}
		GROUP BY chefs.id
		ORDER BY id LIMIT ${limit} OFFSET ${offset}`

		db.query(query, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback(results.rows)
		})
	}
}