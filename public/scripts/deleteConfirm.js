// get the delete form (this is present in many pages, usually in edit sections)
const deleteForm = document.querySelector("#delete-form")

// if a delete command is submit, double check with the user if he wants to delete
deleteForm.addEventListener("submit", (event) => {
	confirm("Você deseja realmente deletar?") ? null : event.preventDefault()
})