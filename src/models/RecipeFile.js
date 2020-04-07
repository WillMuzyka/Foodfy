const db = require("../config/db")
const Base = require('./Base')

Base.init({ table: "recipe_files" })

module.exports = {
	...Base,
	async findAll(recipe_id) {
		const results = await db.query(`
		SELECT files.*
		FROM recipe_files
		JOIN files ON (recipe_files.file_id = files.id)
		WHERE recipe_id = $1
		ORDER BY recipe_files.id`, [recipe_id])

		return results.rows
	}
}