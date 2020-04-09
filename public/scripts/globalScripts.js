// functions for images upload (recipes)
const ImageUpload = {
	files: [],
	input: "",
	preview: document.querySelector(".item #photo-preview"),
	uploadLimit: 5,
	// main function, called by the user, that handles the file input
	handleFileInput(event) {
		ImageUpload.input = event.target
		const { files: filesList } = event.target

		if (ImageUpload.hasLimit(event)) return

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
	// check the limit of images, if the user tries to send more, blocks it
	hasLimit(event) {
		const { uploadLimit, input, preview } = ImageUpload
		const { files: filesList } = input

		if (filesList.length > uploadLimit) {
			alert(`Envie apenas ${uploadLimit} fotos!`)
			event.preventDefault()
			return true
		}

		let photosDiv = []
		preview.childNodes.forEach(item => {
			if (item.classList && item.classList.value == "photo")
				photosDiv.push(item)
		})
		const totalPhotos = filesList.length + photosDiv.length

		if (totalPhotos > uploadLimit) {
			if (photosDiv.length < uploadLimit) {
				alert(`Você pode adicionar mais ${uploadLimit - photosDiv.length} foto(s)!`)
			} else {
				alert(`Limite de fotos atingido!`)
			}
			event.preventDefault()
			return true
		}

		return false
	},
	// check if the user is trying to delete all the images and block it
	hasMinimum(event) {
		const { input, preview } = ImageUpload

		let photosDiv = []
		preview.childNodes.forEach(item => {
			if (item.classList && item.classList.value == "photo")
				photosDiv.push(item)
		})
		const totalPhotos = photosDiv.length
		if (totalPhotos == 1) {
			alert(`Envie no mínimo 1 foto!`)
			event.preventDefault()
			return false
		}

		return true
	},
	// get all the files send by the user and updates it
	// this is required on deletion of images, as you can't
	// change file lists
	getAllFiles() {
		const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

		ImageUpload.files.forEach(file => dataTransfer.items.add(file))

		return dataTransfer.files
	},
	// create a container to preview the uploading images
	getContainer(image) {
		const div = document.createElement("div")
		div.classList.add("photo")

		div.appendChild(image)
		div.appendChild(ImageUpload.getRemoveButton())
		return div
	},
	// create a delete button for the preview container
	getRemoveButton() {
		const button = document.createElement("i")
		button.classList.add("material-icons")
		button.innerHTML = "delete"
		button.onclick = ImageUpload.removeImage

		return button
	},
	// remove an image that is being uploaded
	removeImage(event) {
		const photoDiv = event.target.parentNode
		const photosArray = Array.from(ImageUpload.preview.children)
		let index = photosArray.indexOf(photoDiv)
		const numberFilesBefore = photosArray.length - ImageUpload.files.length
		index -= numberFilesBefore

		if (!ImageUpload.hasMinimum(event)) return
		ImageUpload.files.splice(index, 1)
		ImageUpload.input.files = ImageUpload.getAllFiles()
		photoDiv.remove()
	},
	//remove an image that was already uploaded
	removeOldImage(event) {
		const photoDiv = event.target.parentNode

		if (!ImageUpload.hasMinimum(event)) return

		const removedIdsInput = document.querySelector('input[name="removed_ids"]')
		removedIdsInput.value += `${photoDiv.id},`

		photoDiv.remove()
	}
}

const AvatarUpload = {
	input: "",
	// main function, called by the user, that handles the file input
	handleFileInput(event) {
		AvatarUpload.input = event.target
		const { files } = event.target

		const textInput = document.querySelector(".chef #avatar_src")
		if (textInput) textInput.innerHTML = files[0].name
	},
	// check if there's at least one image being send by the user
	hasMinimum(event) {
		const { input } = AvatarUpload
		const { files: filesList } = input

		if (!filesList) {
			alert(`Envie no mínimo 1 foto!`)
			event.preventDefault()
			return false
		}

		return true
	}
}
