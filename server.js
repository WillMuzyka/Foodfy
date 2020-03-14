const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')

const recipes = require('./src/data')
const aboutText = require('./src/about')

const server = express()

server.set('view engine', 'njk')
server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))
server.use(methodOverride("_method"))
nunjucks.configure('views', {
	express: server,
	noCache: true
})
server.use(routes)

server.listen(5000, () => console.log('Server is running!'))