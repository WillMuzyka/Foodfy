const pagination = document.querySelector(".pagination")
const total = +pagination.dataset.total
const page = +pagination.dataset.page
const filter = pagination.dataset.filter

paginate = (total, page) => {
	if (total == 1) return

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

let elements = []
for (index of paginate(total, page)) {
	//if there's a filter
	let filterURL = ""
	if (filter) filterURL = `filter=${filter}&`
	//create page index
	if (String(index).includes("...")) elements += `<span>${index}</span>`
	else if (index == page) elements += `<a class="active" href="?${filterURL}page=${index}">${index}</a>`
	else elements += `<a href="?${filterURL}page=${index}">${index}</a>`
}

pagination.innerHTML = elements