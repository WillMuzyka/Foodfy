<h1  align="center">
<img  alt="Launchbase"  src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png"  width="400px" />
</h1>
<h3  align="center">
Projeto Foodfy: Bootcamp LaunchBase
</h3>

<p  align="center">
<a  href="https://rocketseat.com.br">
<img  alt="Made with Love"  src="https://img.shields.io/badge/made%20with-love-%23F8952D">
</a>
<a  href="LICENSE">
<img  alt="License"  src="https://img.shields.io/badge/license-MIT-%23F8952D">
</a>
</p>

<p  align="center">
<a  href="#joystick-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#hourglass_flowing_sand-instalação">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#warning-rocketseat">Rocketseat</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#cop-observações">Observações</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#handshake-agradecimentos">Agradecimentos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#memo-licença">Licença</a>
</p>

<p  align="center">
Leia em outras línguas:&nbsp&nbsp&nbsp&nbsp
<a  href="README.md">English</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="README.ptBR.md">Português</a>
</p>
<br />
Esta é uma plataforma com receitas de diferentes chefs, todas com imagens, ingredientes, passo-a-passo e dicas. Os usuários conseguem ver todas as receitas registradas, assim como os chefs e, com uma conta de usuário, pode até adicionar suas próprias receitas.

- Projeto desenvolvido durante o Bootcamp Launchbase.

## :joystick: Tecnologias
Este projeto utiliza várias tecnologias e conceitos. Alguns deles estão listados abaixo.
(Assim como algumas línguas, bibliotecas e frameworks):

* [Node.js](https://nodejs.org/)
* [CSS](https://developer.mozilla.org/docs/Web/CSS)
* [HTML](https://developer.mozilla.org/docs/Web/HTML)
* [Javascript](https://developer.mozilla.org/docs/Web/JavaScript)
* [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [Express](https://expressjs.com/)
* [Multer](https://github.com/expressjs/multer)
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* [PostgreSQL](https://www.postgresql.org/)

## :hourglass_flowing_sand: Instalação:

Para instalar e usar esta aplicação, primeiro tenha certeza de que você tem instalado o node e npm em sua máquina. Ambos são essenciais para o funcionamento da aplicação.

Todo o projeto foi desenvolvido com base no Node.js. Se você quer utilizar esta biblioteca, por favor faça o clone deste repositório e verifique as instruções seguintes.

**Passos**

1. Abra o terminal do seu computador e altere o diretório de trabalho para o local que deseja salvar esta aplicação. Rode o código `git clone https://github.com/WillMuzyka/foodfy.git`. Abra a pasta principal usando o comando `cd foodfy`.

2. Na pasta principal da aplicação, rode o comando `npm install` para instalar todos os pacotes necessários listados no arquivo *`package.json`*. Note que alguns pacotes contêm dependências que serão instalados com este comando e que são necessárias para o funcionamento da aplicação.

3. Esta aplicação requer uma base de dados em que todas as informações das receitas, chefs e usuários são armazenadas. Para isto, eu utilizei o postgreSQL e eles têm uma documentação detalhada em como configurar sua máquina. Por favor, leia as [instruções de instalações](https://www.postgresql.org/docs/12/tutorial-install.html) presentes no site deles para iniciar a base de dados.

4. Após instalar o postgres, você irá precisar do Postbird, um IDE para se comunicar com o servidor. Utilize o mesmo login e senha no arquivo *`src/config/db.jd`*, ou modifique o arquivo para as suas configurações. Se você estiver utilizando uma porta diferente da padrão, será necessário também modificar isto no arquivo.

5. Abra o Postbird e rode a query `CREATE DATABASE foodfy;`. Isto irá iniciar uma nova base de dados. Após isso, rode o código presente em "data/db.sql", ignorando os três primeiros comandos: eles são para criação da base de dados e limpeza de possíveis resíduos, você não irá precisar disto na primeira instalação. Rode todos os comando após o comentário *`--create the table`*.

6. Com a base de dados configurada, rode o comando `node data/seed.js` na pasta principal. Isso irá popular a base de dados com valores aleatórios de receitas, chefs e usuários (a **senha padrão** dos usuários é **`asd`**). No futuro, caso não seja necessite disso, você pode deletar as pastas "food" e "profiles" de "public/images". Elas são imagens para o seed de receitas e chefs. Caso deseje reiniciar os dados, pode rodar os comandos presentes em "data/cleanDb.sql" (primeiro bloco para derrubar a base de dados e restante para limpar tabelas).

7. Na situação atual do projeto, o sistema não irá enviar um e-mail para o usuário (em situações de "registro" e "esqueceu a senha"). Os e-mails são enviados para o [Mailtrap](https://mailtrap.io/), um serviço gratuito. Por favor, crie uma conta na plataforma e use as configurações em "integration" para `nodemailer`. Você deve alterar com suas próprias informações em *`src/lib/mailer.js`*.

8. Após a instalação dos pacotes, rode o comando `npm start` para inicializar o servidor. Isso irá continuar executando até a finalização da aplicação (Ctrl + C). Este aplicativo não irá rodar em segundo plano, então é necessário manter a janela aberta. Essa aplicação usa a porta `:5000` (e `:3000` se você utilizar nodemon ou `:9229` para debug), então tenha cuidado para não haver outra aplicação rodando na mesma porta.

9. Aproveite a aplicação!

## :warning: Rocketseat
### Se você faz parte da equipe da Rocketseat, por favor leia o texto a seguir, ele contém algumas informações importantes sobre o projeto

Esse projeto satisfaz todos os pré-requisitos dos desafios e exercícios do curso. Porém eu tomei a liberdade de adicionar outras funcionalidades que acredito incrementar um pouco a experiência do usuário. Algumas são mudanças sutis e outras adicionam mais páginas ou mudam as regras iniciais propostas. Algumas delas são:

* Campo para procurar por chefs quando na página de chefs;
* Adicionado botão de retorno na página de recuperar senha;
* Adicionado ícones nas páginas de login e recuperar senha;
* Adicionado página de primeiro login, para definir sua senha;
* Adicionado transições para maioria dos botões;
* Quando acessado por alguém que não é administrador, alguns botões são ocultados (ou alterados) na área administrativa, como o botão de chefs que é ocultado (uma vez que um usuário regular não pode adicionar, modificar ou deletar um chef) e o botão de usuários é alterado para "Conta" (já que um usuário só pode alterar sua própria conta);
* Adicionado Base.js em *models*, com funções base para outros *models*;
* Adicionado um arquivo de seed, criando dados em receitas, chefs e usuários;
* Adicionado animações na criação de usuário (sucesso e falha).

No meu ponto de vista, essas mudanças melhoram a aplicação e não tem o propósito de substituir qualquer outro requisito deste desafio.

## :cop: Observações

Por favor note que este projeto foi desenvolvido durante um bottcamp para melhor entender os conceitos de node.js, javascript e desenvolvimento web.

Esta não é uma versão final (para deploy) da aplicação e pode conter bugs e erros. O propósito deste código é para aprendizado e eu não tenho nenhuma garantia caso você deseje implantá-lo ou utilizá-lo comercialmente.

## :handshake: Agradecimentos

Gostaria de agradecer a equipe da Rocketseat por este bootcamp incrível, com diversos vídeos, exercícios e desafios. Eu aprendi muito durante essas semanas, tanto com os conteúdos ensinados quanto com a comunidade que está sempre se ajudando. Caso alguém tenha interesse em mais informações sobre eles, este é o [link](https://rocketseat.com.br/) para o website deles.

## :memo: LICENÇA

Este projeto está sob a Licença MIT. Para mais informações, por favor consulte a [LICENÇA](LICENSE).
