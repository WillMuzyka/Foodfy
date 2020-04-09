// configuration for the database
const { Pool } = require("pg")

module.exports = new Pool({
	user: "Muzyka",
	password: "postgres",
	host: "localhost",
	port: 5432,
	database: "foodfy"
})