const db = require("../config/db")

module.exports = {
	create(values) {
		const query = `
		INSERT INTO recipe_files(
			recipe_id,
			file_id)
		VALUES ($1, $2)
		RETURNING id`

		return db.query(query, values)
	},
	getAll(recipe_id) {
		return db.query(`
		SELECT *
		FROM recipe_files
		WHERE recipe_id = $1`, [recipe_id])
	},
	find(recipe_id) {
		return db.query(`
		SELECT files.*
		FROM recipe_files
		JOIN files ON (recipe_files.file_id = files.id)
		WHERE recipe_id = $1`, [recipe_id])
	},
	delete(file_id) {
		return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [file_id])
	}
}