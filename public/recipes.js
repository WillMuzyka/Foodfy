const recipes = document.querySelectorAll('.recipe');

recipes.forEach((recipe, index) => recipe.addEventListener('click', () => {
	window.location.href = `/recipe/${index}`
}));