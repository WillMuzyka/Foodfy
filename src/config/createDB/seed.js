const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('../../models/User')
const Chef = require('../../models/Chef')
const File = require('../../models/File')
const Recipe = require('../../models/Recipe')
const RecipeFile = require('../../models/RecipeFile')

const totalUsers = 10
let totalAvatar
let totalFoodImages
const totalRecipes = 10
const totalFilesPerRecipe = 3

let avatarArray = []
let foodImageArray = []

let usersId = []
let chefsId = []
let recipesId = []

function createProfileAvatarArray() {
	for (let i = 0; i < 6; i++) {
		avatarArray.push(`public/images/profile/w${i + 1}.jpg`)
		avatarArray.push(`public/images/profile/m${i + 1}.jpg`)
	}
	totalAvatar = avatarArray.length
}

function createFoodImagesArray() {
	for (let i = 0; i < 15; i++) {
		foodImageArray.push(`public/images/food/f${i + 1}.jpg`)
	}
	totalFoodImages = foodImageArray.length
}

async function createUser() {
	let users = []
	const password = await hash('asd', 8)

	while (users.length < totalUsers) {
		users.push({
			name: faker.name.firstName(),
			email: faker.internet.email(),
			password,
			is_admin: Math.random() > 0.5
		})
	}

	const usersPromise = users.map(user => User.create(user))
	usersId = await Promise.all(usersPromise)
}

async function createChef() {
	//avatars
	let files = []

	avatarArray.map(path => {
		files.push({
			name: faker.image.food(),
			path
		})
	})

	const filesPromise = files.map(file => File.create(file))
	const filesId = await Promise.all(filesPromise)

	//chefs
	let chefs = []

	filesId.map(id => {
		chefs.push({
			name: faker.name.firstName(),
			file_id: id
		})
	})

	const chefsPromise = chefs.map(chef => Chef.create(chef))
	chefsId = await Promise.all(chefsPromise)
}

async function createRecipe() {
	try {
		//images
		let files = []

		while (files.length < (totalRecipes * totalFilesPerRecipe)) {
			files.push({
				name: faker.image.food(),
				path: foodImageArray[Math.floor(Math.random() * foodImageArray.length)]
			})
		}
		const filesPromise = files.map(file => File.create(file))
		const filesId = await Promise.all(filesPromise)
		//recipes
		let recipes = []

		while (recipes.length < totalRecipes) {
			let ingredients = [], preparation = []
			while (ingredients.length < (Math.ceil(Math.random() * 3))) {
				ingredients.push(faker.lorem.paragraph())
			}
			while (preparation.length < (Math.ceil(Math.random() * 3))) {
				preparation.push(faker.lorem.paragraph())
			}

			recipes.push({
				chef_id: chefsId[Math.floor(Math.random() * chefsId.length)],
				user_id: usersId[Math.floor(Math.random() * usersId.length)],
				title: faker.commerce.product(),
				ingredients: `{${ingredients.join(',')}}`,
				preparation: `{${preparation.join(',')}}`,
				information: faker.lorem.paragraphs(Math.ceil(Math.random() * 3))
			})
		}
		const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
		recipesId = await Promise.all(recipesPromise)
		//recipe_files
		let recipe_files = []

		for (i = 0; i < totalRecipes; i++) {
			for (let j = 0; j < 3; j++) {
				recipe_files.push({
					recipe_id: recipesId[i],
					file_id: filesId[i * 3 + j]
				})
			}
		}

		const recipesFilesPromise = recipe_files.map(rf => RecipeFile.create(rf))
		await Promise.all(recipesFilesPromise)
	} catch (error) {
		console.error(error)
	}
}

async function init() {
	createProfileAvatarArray()
	createFoodImagesArray()
	await createUser()
	await createChef()
	await createRecipe()
}

init()