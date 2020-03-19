const db = require("../config/db")

module.exports = {
	all(callback) {
		const query = `SELECT recipes.*, chefs.name author
		FROM recipes
		LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
		ORDER BY id`
		db.query(query, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback(results.rows)
		})
	},
	create(values, callback) {
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

		db.query(query, values, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback()
		})
	},
	find(id, callback) {
		const query = `
		SELECT recipes.*, chefs.name author
		FROM recipes
		LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
		WHERE recipes.id = $1`

		db.query(query, [id], (err, results) => {
			if (err) throw `Databaerror! ${err}`
			callback(results.rows[0])
		})
	},
	update(values, callback) {
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

		db.query(query, values, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback()
		})
	},
	delete(id, callback) {
		const query = `
		DELETE
		FROM recipes
		WHERE id = $1`

		db.query(query, [id], (err, results) => {
			if (err) throw `Databaerror! ${err}`
			callback()
		})
	},
	chefOption(callback) {
		const query = `
		SELECT name, id
		FROM chefs
		ORDER BY name`

		db.query(query, (err, results) => {
			if (err) throw `Databaerror! ${err}`
			callback(results.rows)
		})
	},
	paginate(params, callback) {
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

		db.query(query, (err, results) => {
			if (err) throw `Database error! ${err}`
			callback(results.rows)
		})
	}
}