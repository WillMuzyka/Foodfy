// get all the links and the current location
const links = document.querySelectorAll(".links a")
const url = location.href

// add the class "active" if the link is the current location
links.forEach(link => {
	if (url.includes(link.getAttribute("href"))) link.classList.add("active")
})