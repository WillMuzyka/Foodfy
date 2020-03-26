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

const galleryContainer = document.querySelector(".gallery")
let colTC = ""
for (let i = 0; i < galleryContainer.children.length; i++) {
	colTC += "1fr "
}
galleryContainer.style.gridTemplateColumns = colTC


const ImageGallery = {
	highlight: document.querySelector(".highlight > img"),
	gallery: document.querySelectorAll(".gallery img"),
	setImage(event) {
		ImageGallery.gallery.forEach(image => image.classList.remove("active"))
		event.target.classList.add("active")

		ImageGallery.highlight.src = event.target.src

	}
}