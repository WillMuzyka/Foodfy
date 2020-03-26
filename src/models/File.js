const fs = require('fs')
const db = require("../config/db")

module.exports = {
	create(values) {
		const query = `
		INSERT INTO files(
			name,
			path)
		VALUES ($1, $2)
		RETURNING id`

		return db.query(query, values)
	},
	find(id) {
		return db.query(`
		SELECT *  
		FROM files
		WHERE id = $1`, [id])
	},
	async delete(id) {
		try {
			const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
			const file = results.rows[0]

			fs.unlinkSync(file.path)

			return db.query(`DELETE FROM files WHERE id = $1`, [id])
		}
		catch (err) {
			console.error(err)
		}
	}
}