const links = document.querySelectorAll(".links a")
const url = location.href

links.forEach(link => {
	if (url.includes(link.getAttribute("href"))) link.classList.add("active")
})