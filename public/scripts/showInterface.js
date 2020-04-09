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

// change the number of columns in the gallery preview section
// this is necessary because on the change of showing/hiding the text
// this extra columns usually push the elements to the center
// with this, the aesthetics of the page improved
const galleryContainer = document.querySelector(".gallery")
let colTC = ""
for (let i = 0; i < galleryContainer.children.length; i++) {
	colTC += "1fr "
}
galleryContainer.style.gridTemplateColumns = colTC

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