const pagination = document.querySelector(".pagination")
const total = +pagination.dataset.total
const page = +pagination.dataset.page
const limit = +pagination.dataset.limit
const filter = pagination.dataset.filter

// this function creates a index of pages based on the number of pages
// and the current page, returning and array with the index
paginate = (total, page) => {
	if (total == 1) return []

	let pageIndex = [1]
	if (page == 5) pageIndex.push(2)
	else if (page > 5) pageIndex.push("...")

	for (let i = -2; i <= 2; i++) {
		const nextIndex = page + i
		if (nextIndex > 1 && nextIndex < total) pageIndex.push(nextIndex)
	}

	if (page == total - 4) pageIndex.push(total - 1)
	else if (page < total - 4) pageIndex.push("...")
	pageIndex.push(total)

	return (pageIndex)
}

// create all the elements based on the pages index array
let elements = []
for (index of paginate(total, page)) {
	//if there's a filter
	let filterURL = ""
	if (filter) filterURL = `filter=${filter}&`
	//if there's a limit
	let limitURL = ""
	if (limit) limitURL = `limit=${limit}&`
	//create page index
	const extraURL = limitURL + filterURL
	if (String(index).includes("...")) elements += `<span>${index}</span>`
	else if (index == page) elements += `<a class="active" href="?${extraURL}page=${index}">${index}</a>`
	else elements += `<a href="?${extraURL}page=${index}">${index}</a>`
}

//add the elements on the document
pagination.innerHTML = elements