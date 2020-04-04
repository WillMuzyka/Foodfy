const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(session)
server.use((req, res, next) => {
	res.locals.session = req.session
	next()
})
server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))
server.use(methodOverride("_method"))

server.set('view engine', 'njk')
nunjucks.configure('src/app/views', {
	express: server,
	noCache: true
})
server.use(routes)

server.use((req, res) => {
	res.status(404).render("err", { errorText: "Página não encontrada (status 404)" })
})

server.listen(5000, () => console.log('Server is running!'))