// session configuration for user login
const session = require('express-session')
const pgSession = require('connect-pg-simple')(session)
const db = require('./db.js')

module.exports = session({
	store: new pgSession({
		pool: db
	}),
	secret: 'xim4z5FqD8Q*m^Bt22RJuP4Manl&2Qcj',
	resave: false,
	saveUninitialized: false,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000
	}
})