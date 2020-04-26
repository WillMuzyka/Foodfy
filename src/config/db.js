// configuration for the database
const { Pool, Client } = require("pg")

function generateDB() {
	if(process.env.NODE_ENV === 'development') {
		const newDb = new Pool({
			user: process.env.DB_USER,
			password: process.env.DB_PASS,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME
		})
		return newDb
	} else {
		const client = new Client({
			connectionString: process.env.DATABASE_URL,
			ssl: true,
		})
		
		client.connect();
		return client
	}
}

module.exports = generateDB()