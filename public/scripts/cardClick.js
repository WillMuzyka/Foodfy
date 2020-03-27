const recipes = document.querySelectorAll('.recipe')

recipes.forEach(recipe => {
	recipe.addEventListener('click', () => {
		const id = recipe.getAttribute("id")
		window.location.href = `/recipes/${id}`
	})
});

const chefs = document.querySelectorAll('.chef.card')

chefs.forEach(chef => {
	chef.addEventListener('click', () => {
		const id = chef.getAttribute("id")
		console.log(id)
		window.location.href = `/chefs/${id}`
	})
});