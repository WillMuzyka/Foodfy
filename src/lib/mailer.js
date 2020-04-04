const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
	host: "smtp.mailtrap.io",
	port: 2525,
	auth: {
		user: "fe3ec0810fb5ce",
		pass: "40170e0123d74c"
	}
});