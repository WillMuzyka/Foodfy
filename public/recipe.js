const showButtons = document.querySelectorAll('.showText');
const infos = document.querySelectorAll('.info');

showButtons.forEach((button, index) => button.addEventListener('click', () => {
	infos[index].classList.contains("hidden") ?
		(infos[index].classList.remove("hidden"),
			button.classList.remove("hidden"),
			button.innerHTML = "Esconder") :
		(infos[index].classList.add("hidden"),
			button.classList.add("hidden"),
			button.innerHTML = "Mostrar")
}))