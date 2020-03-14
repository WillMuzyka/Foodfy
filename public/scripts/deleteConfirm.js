const deleteForm = document.querySelector("#delete-form")

deleteForm.addEventListener("submit", (event) => {
	confirm("Você deseja realmente deletar?") ? null : event.preventDefault()
})