module.exports = {
	showDate(timestamp) {
		const date = new Date(timestamp)
		year = date.getUTCFullYear()
		month = date.getUTCMonth()
		day = date.getUTCDate()
		return {
			iso: `${year}-${month}-${day}`,
			format: `${day}/${month}/${year}`
		}
	}
}