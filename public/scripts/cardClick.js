// get all the recipes
const recipes = document.querySelectorAll('.recipe')

// for each recipe, add an event listener that redirects
// the user to the recipe when he clicks the recipe card
recipes.forEach(recipe => {
	recipe.addEventListener('click', () => {
		const id = recipe.getAttribute("id")
		window.location.href = `/recipes/${id}`
	})
});

// get all the chefs
const chefs = document.querySelectorAll('.chef.card')

// for each chef, add an event listener that redirects
// the user to the chef when he clicks the chef card
chefs.forEach(chef => {
	chef.addEventListener('click', () => {
		const id = chef.getAttribute("id")
		window.location.href = `/chefs/${id}`
	})
});