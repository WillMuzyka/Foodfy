const modalOverlay = document.querySelector('.modal-overlay');
const closeModal = document.querySelector('.modal-close');
const recipes = document.querySelectorAll('.recipe');

recipes.forEach(recipe => recipe.addEventListener('click', () => {
	modalOverlay.classList.add('active');
	modalOverlay.querySelector('img').src = recipe.querySelector('img').src;
	modalOverlay.querySelector('.modal-title').textContent = recipe.querySelector('.recipe-name').textContent;
	modalOverlay.querySelector('.modal-author').textContent = recipe.querySelector('.recipe-author').textContent;
}));

closeModal.addEventListener('click', () => modalOverlay.classList.remove('active'));