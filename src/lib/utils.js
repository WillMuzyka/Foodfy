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
			//ERRPR
			//permissions
			case "ao": return "Você não tem direito sobre esta conta."
			case "dr": return "Você não pode deletar sua própria conta."
			case "uo": return "Você não tem permissão de acessar esta área."
			case "ar": return "Você não tem direitos administrativos."
			case "ro": return "Você não tem direito sobre esta receita."
			//loading
			case "de": return "Erro ao deletar. Por favor, tente novamente."
			case "ue": return "Erro ao atualizar. Por favor, tente novamente."
			case "pg": return "Erro ao acessar página. Por favor, tente novamente."
			//update
			case "ei": return "Este email já está sendo utilizado."
			case "pi": return "Senha incorreta."

			//SUCCESS
			//create
			case "uc": return "Usuário criado com sucesso."
			case "rc": return "Receita criada com sucesso."
			case "cc": return "Chef criado com sucesso."
			//update
			case "pu": return "Senha atualizada com sucesso."
			case "uu": return "Usuário atualizado com sucesso."
			case "ru": return "Receita atualizada com sucesso."
			case "cu": return "Chef atualizado com sucesso."
			//delete
			case "ud": return "Usuário deletado com sucesso."
			case "rd": return "Receita deletada com sucesso."
			case "cd": return "Chef deletado com sucesso."

			default: return message
		}
	},
}