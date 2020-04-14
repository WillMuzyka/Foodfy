// mailer configuration for using mailtrap
const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
	host: "",
	port: 0,
	auth: {
		user: "",
		pass: ""
	}
});