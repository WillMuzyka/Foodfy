const express = require("express")
const nunjucks = require("nunjucks")

const recipes = require("./src/data")
const aboutText = require("./src/about")

const server = express()

server.set("view engine", "njk")
server.use(express.static("public"))
nunjucks.configure("views", {
	express: server,
	noCache: true
})

server.get("/", (req, res) => {
	return res.render("home", { recipes })
})

server.get("/about", (req, res) => {
	return res.render("about", { aboutText })
})

server.get("/recipes", (req, res) => {
	return res.render("recipes", { recipes })
})

server.get("/recipe/:recipeID", (req, res) => {
	const id = req.params.recipeID % recipes.length
	const showingRecipe = recipes[id]
	return res.render("recipe", { recipe: showingRecipe })
})

server.listen(5001, () => console.log("Server is running!"))