
const ImageUpload = {
	input: "",
	preview: document.querySelector(".item #photo-preview"),
	files: [],
	handleFileInput(event) {
		ImageUpload.input = event.target
		const { files: filesList } = event.target

		Array.from(filesList).forEach(file => {
			ImageUpload.files.push(file)

			const reader = new FileReader()

			reader.onload = () => {
				const image = new Image()
				image.src = String(reader.result)

				const newContainer = ImageUpload.getContainer(image)
				ImageUpload.preview.appendChild(newContainer)
			}

			reader.readAsDataURL(file)
		})
		ImageUpload.input.files = ImageUpload.getAllFiles()
	},
	getAllFiles() {
		const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

		ImageUpload.files.forEach(file => dataTransfer.items.add(file))

		return dataTransfer.files
	},
	getContainer(image) {
		const div = document.createElement("div")
		div.classList.add("photo")

		div.appendChild(image)
		div.appendChild(ImageUpload.getRemoveButton())
		return div
	},
	getRemoveButton() {
		const button = document.createElement("i")
		button.classList.add("material-icons")
		button.innerHTML = "delete"
		button.onclick = ImageUpload.removeImage

		return button
	},
	removeImage(event) {
		const photoDiv = event.target.parentNode
		const photosArray = Array.from(ImageUpload.preview.children)
		const index = photosArray.indexOf(photoDiv)

		ImageUpload.files.splice(index, 1)

		ImageUpload.input.files = ImageUpload.getAllFiles()
		photoDiv.remove()
	}
}


