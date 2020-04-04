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
	},
	showMessage(message) {
		switch (message) {
			case "ao": return "Você não tem direito sobre esta conta."
			case "dr": return "Você não pode deletar sua própria conta."
			case "uo": return "Você não tem permissão de acessar esta área."
			case "ar": return "Você não tem direitos administrativos."
			case "ro": return "Você não tem direito sobre esta receita."
		}
	},
}