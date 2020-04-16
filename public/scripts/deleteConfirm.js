// get the delete form (this is present in many pages, usually in edit sections)
const deleteForms = document.querySelectorAll("#delete-form")

// if a delete command is submit, double check with the user if he wants to delete
deleteForms.forEach(form => form.addEventListener("submit", (event) => {
	confirm("Você deseja realmente deletar?") ? null : event.preventDefault()
}))