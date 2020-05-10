// get the show/hide buttons and the info text
const showButtons = document.querySelectorAll('.showText');
const infos = document.querySelectorAll('.info');

// for each button, add an event listener on click that hides or
// shows the text info
showButtons.forEach((button, index) => button.addEventListener('click', () => {
	infos[index].classList.contains("hidden") ?
		(infos[index].classList.remove("hidden"),
			button.classList.remove("hidden"),
			button.innerHTML = "Esconder") :
		(infos[index].classList.add("hidden"),
			button.classList.add("hidden"),
			button.innerHTML = "Mostrar")
}))

/// highlight the current image that is being display on top
const ImageGallery = {
	highlight: document.querySelector(".highlight > img"),
	gallery: document.querySelectorAll(".gallery img"),
	setImage(event) {
		ImageGallery.gallery.forEach(image => image.classList.remove("active"))
		event.target.classList.add("active")

		ImageGallery.highlight.src = event.target.src

	}
}