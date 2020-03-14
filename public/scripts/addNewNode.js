//ingredient
addIngredient = () => {
	const ingredients = document.querySelector("#ingredients")
	const allIngredients = document.querySelectorAll(".ingredient")

	let newIngredient = allIngredients[allIngredients.length - 1].cloneNode(true)
	if (newIngredient.children[0].value == "") {
		return alert("Campo vazio")
	}

	newIngredient.children[0].value = ""
	newIngredient.children[0].required = false
	ingredients.insertBefore(newIngredient, ingredients.children[allIngredients.length + 1])
}

document.querySelector(".add-ingredient").addEventListener("click", addIngredient)

//step
addStep = () => {
	const preparation = document.querySelector("#preparation")
	const allSteps = document.querySelectorAll(".step")

	let newStep = allSteps[allSteps.length - 1].cloneNode(true)
	if (newStep.children[0].value == "") {
		return alert("Campo vazio")
	}

	newStep.children[0].value = ""
	preparation.insertBefore(newStep, preparation.children[allSteps.length + 1])
}

document.querySelector(".add-step").addEventListener("click", addStep)