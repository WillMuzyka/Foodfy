const recipes = document.querySelectorAll('.recipe');

recipes.forEach(recipe => {
	recipe.addEventListener('click', () => {
		const id = recipe.getAttribute("id")
		window.location.href = `/recipes/${id}`
	})
});