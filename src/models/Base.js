const db = require("../config/db")
const separateWith = '","'

function find(fields, table) {
	let query = `SELECT * FROM ${table}`
	Object.keys(fields).map(key => {
		query += ` ${key}`
		Object.keys(fields[key]).map(field => {
			query += ` ${field} = '${fields[key][field]}'`
		})
	})
	return db.query(query)
}

module.exports = {
	init({ table }) {
		if (!table) throw new Error("Invalid params!")
		this.table = table
	},
	async create(fields) {
		try {
			let tags = [], values = []
			Object.keys(fields).map(key => {
				tags.push(key)
				if (Array.isArray(fields[key]))
					values.push(`'{ "${fields[key].join(separateWith)}" }'`)
				else
					values.push(`'${fields[key]}'`)
			})

			const query = `INSERT INTO ${this.table} (${tags.join(",")})
				VALUES (${values.join(",")})
				RETURNING id`
				
			const results = await db.query(query)
			return results.rows[0].id
		}
		catch (error) {
			console.error(error);

		}
	},
	async find(id) {
		const results = await find({ where: { id } }, this.table)
		return results.rows[0]
	},
	async findOne(fields) {
		const results = await find(fields, this.table)
		return results.rows[0]
	},
	async findAll(fields) {
		const results = await find(fields, this.table)
		return results.rows
	},
	update(id, fields) {
		let query = `UPDATE ${this.table} SET`
		Object.keys(fields).map((key, index, array) => {
			if (fields[key] != null) {
				if (Array.isArray(fields[key]))
					query += ` ${key} = '{ "${fields[key].join(separateWith)}" }'`
				else
					query += ` ${key} = '${fields[key]}'`
			} else {
				query += ` ${key} = NULL`
			}

			if (index + 1 < array.length)
				query = `${query},`
			else
				query = `${query} WHERE id = '${id}'`
		})

		console.log(query)
		return db.query(query)
	},
	delete(id) {
		const query = `DELETE FROM ${this.table} WHERE id = '${id}'`

		return db.query(query)
	},
}