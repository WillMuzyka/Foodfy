const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('../src/models/User')
const Chef = require('../src/models/Chef')
const File = require('../src/models/File')
const Recipe = require('../src/models/Recipe')
const RecipeFile = require('../src/models/RecipeFile')

const totalUsers = 10
const totalRecipes = 10
const totalFilesPerRecipe = 3
// DO NOT CHANGE THESE TWO NEXT LINE, SINCE THIS IS RELATED TO THE NUMBER OF IMAGES
// If you check the public/images, there're two folder, one with food images and 
// another one with profile pictures. There're 15 and 12 photos, respectively.
let totalFoodImages = 15
let totalAvatar = 12

let avatarArray = []
let foodImageArray = []

let usersId = []
let chefsId = []
let recipesId = []

//this function create the path for the profile pictures (avatar)
function createProfileAvatarArray() {
	for (let i = 0; i < 6; i++) {
		avatarArray.push(`public/images/profile/w${i + 1}.jpg`)
		avatarArray.push(`public/images/profile/m${i + 1}.jpg`)
	}
}

//this function create the path for the food images
function createFoodImagesArray() {
	for (let i = 0; i < 15; i++) {
		foodImageArray.push(`public/images/food/f${i + 1}.jpg`)
	}
}

//this function creates the users
async function createUser() {
	let users = []
	//default password as 'asd'
	const password = await hash('asd', 8)
	//push the defined number of users into an array
	while (users.length < totalUsers) {
		users.push({
			name: faker.name.firstName(),
			email: faker.internet.email(),
			password,
			is_admin: Math.random() > 0.5
		})
	}
	//create the users
	const usersPromise = users.map(user => User.create(user))
	usersId = await Promise.all(usersPromise)
}

//this function creates the chefs
async function createChef() {
	// ~~FILES
	let files = []
	//push the profile pictures into an array of objects that
	//have both the path and the name for the pictures
	avatarArray.map(path => {
		files.push({
			name: faker.image.food(),
			path
		})
	})
	//create the files (profile pictures of chefs)
	const filesPromise = files.map(file => File.create(file))
	const filesId = await Promise.all(filesPromise)

	// ~~CHEFS
	let chefs = []
	//push the files into an array of objects that
	//have both the file_id and the name for the chefs
	filesId.map(id => {
		chefs.push({
			name: faker.name.firstName(),
			file_id: id
		})
	})
	//create the chefs
	const chefsPromise = chefs.map(chef => Chef.create(chef))
	chefsId = await Promise.all(chefsPromise)
}

//this function creates the recipes
async function createRecipe() {
	try {
		// ~~FILES
		let files = []
		//push the files with the food images
		//pleease notice that some files will contain the same image
		while (files.length < (totalRecipes * totalFilesPerRecipe)) {
			files.push({
				name: faker.image.food(),
				path: foodImageArray[Math.floor(Math.random() * foodImageArray.length)]
			})
		}
		//create the files
		const filesPromise = files.map(file => File.create(file))
		const filesId = await Promise.all(filesPromise)

		// ~~RECIPES
		let recipes = []
		//push the defined number of recipes into an array with recipes' info
		while (recipes.length < totalRecipes) {
			let ingredients = [], preparation = []
			//create fake data for ingredients and preparation
			//these are separated because they are arrays
			while (ingredients.length < (Math.ceil(Math.random() * 3))) {
				ingredients.push(faker.lorem.paragraph())
			}
			while (preparation.length < (Math.ceil(Math.random() * 3))) {
				preparation.push(faker.lorem.paragraph())
			}
			//push the recipe into the array
			recipes.push({
				chef_id: chefsId[Math.floor(Math.random() * chefsId.length)],
				user_id: usersId[Math.floor(Math.random() * usersId.length)],
				title: faker.commerce.product(),
				ingredients: `{${ingredients.join(',')}}`,
				preparation: `{${preparation.join(',')}}`,
				information: faker.lorem.paragraphs(Math.ceil(Math.random() * 3))
			})
		}
		//create the recipes
		const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
		recipesId = await Promise.all(recipesPromise)

		// ~~RECIPE_FILES
		let recipe_files = []
		//for each recipe, put at least 3 images
		for (i = 0; i < totalRecipes; i++) {
			for (let j = 0; j < 3; j++) {
				recipe_files.push({
					recipe_id: recipesId[i],
					file_id: filesId[i * 3 + j]
				})
			}
		}
		//create the relation between the files and recipes (a third table)
		const recipesFilesPromise = recipe_files.map(rf => RecipeFile.create(rf))
		await Promise.all(recipesFilesPromise)
	} catch (error) {
		console.error(error)
	}
}

//function that runs the seed in the correct order
async function init() {
	createProfileAvatarArray()
	createFoodImagesArray()
	await createUser()
	await createChef()
	await createRecipe()
}

init()