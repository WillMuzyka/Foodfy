// ingredient
addIngredient = () => {
	// get the ingredients
	const ingredients = document.querySelector("#ingredients")
	const allIngredients = document.querySelectorAll(".ingredient")
	// copy the last input (reference to create a new one)
	let newIngredient = allIngredients[allIngredients.length - 1].cloneNode(true)
	// if the last one is empty, return an alert (this will not let this process continue)
	if (newIngredient.children[0].value == "") {
		return alert("Campo vazio")
	}
	// reset the values of the input and set it to not required
	// remember that at least one ingredient is required, and when you copy it,
	// you also copy this property
	newIngredient.children[0].value = ""
	newIngredient.children[0].required = false
	// insert the new ingredient
	ingredients.insertBefore(newIngredient, ingredients.children[allIngredients.length + 1])
}

// step
addStep = () => {
	// get the preparation
	const preparation = document.querySelector("#preparation")
	const allSteps = document.querySelectorAll(".step")
	// copy the last input (reference to create a new one)
	let newStep = allSteps[allSteps.length - 1].cloneNode(true)
	// if the last one is empty, return an alert (this will not let this process continue)
	if (newStep.children[0].value == "") {
		return alert("Campo vazio")
	}
	// reset the values of the input and set it to not required
	// remember that at least one step is required, and when you copy it,
	// you also copy this property
	newStep.children[0].value = ""
	newStep.children[0].required = false
	// insert the new step
	preparation.insertBefore(newStep, preparation.children[allSteps.length + 1])
}

// add an event listener to the button ".add-ingredient" and "add-step"
document.querySelector(".add-ingredient").addEventListener("click", addIngredient)
document.querySelector(".add-step").addEventListener("click", addStep)