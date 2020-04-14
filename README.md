<h1  align="center">
<img  alt="Launchbase"  src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png"  width="400px" />
</h1>
<h3  align="center">
Project Foodfy: Bootcamp LaunchBase
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
<a  href="#joystick-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#hourglass_flowing_sand-installation">Installation</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#warning-rocketseat">Rocketseat</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#cop-remarks">Remarks</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#handshake-thanks">Thanks</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="#memo-license">License</a>
</p>

<p  align="center">
Read in other languages:&nbsp&nbsp&nbsp&nbsp
<a  href="README.ptBR.md">Português</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
<a  href="README.md">English</a>
</p>
<br />

This is a platform with recipes from different chefs, all with images, ingredients, steps to follow through and tips. The user can see all the recipes that are registered, the chefs and, with you have an user account, you can add your own recipes.

- Project developed during the Launchbase Bootcamp.

## :joystick: Technologies

This project used a lot of technologies and concepts. A few of them are listed below.
(Also some languages, libraries and frameworks):

* [Node.js](https://nodejs.org/)
* [CSS](https://developer.mozilla.org/docs/Web/CSS)
* [HTML](https://developer.mozilla.org/docs/Web/HTML)
* [Javascript](https://developer.mozilla.org/docs/Web/JavaScript)
* [bcryptjs](https://www.npmjs.com/package/bcryptjs)
* [Express](https://expressjs.com/)
* [Multer](https://github.com/expressjs/multer)
* [Nunjucks](https://mozilla.github.io/nunjucks/)
* [PostgreSQL](https://www.postgresql.org/)

## :hourglass_flowing_sand: Installation:

To install and use this application, first be sure that you have node and npm installed. They are essential for running the application.

The whole project was made based on Node.js. If you want to use this library, please clone this repository and check the following steps.

**Steps**

1. Open your computer's terminal and change for the directory that you want to keep this application. Run the code `git clone https://github.com/WillMuzyka/foodfy.git`. Open the main folder using `cd foodfy`.

2. In the main folder, run the command `npm install` to install all the required packages listed on the file *`package.json`*. Note that some packages also have dependencies that are all being installed with this command and are required to the application.

3. This application requires a database where all the info from recipes, chefs and users are stored. For this I used the postgreSQL and they have a rich documentation on how to setup your machine. Please, refer to [their instructions](https://www.postgresql.org/docs/12/tutorial-install.html) to start the database.

4. After installing the postgres, you'll need Postbird, an IDE to communicate with the server. Use the same login and password on the file *`src/config/db.jd`*, or change the file for your own settings. If you're using a different port from default, please be aware that you also need to change that on the file.

5. Open the Postbird and run the query `CREATE DATABASE foodfy;`. This will start a new database. After that, run the code in "data/db.sql", skipping the first three commands: they are for creating the database and cleaning any possible residues, you won't need that on the first installation. Run everything after the comment *`--create the table`*.

6. With the database setup, run the command `node data/seed.js` in the main folder. This will populate the database with some random data in recipes, chefs and users (the default **password** is **`asd`**). In future, with you don't need this, you can also delete the folders "food" and "profile" from "public/images". These are image placeholders for this seed's recipes and chefs. If you want to reboot the database, you can run the commands in "data/cleanDb.sql" (first block of code for dropping the database and the ramaining for cleaning the tables).

7. In the current stage of this project, the system will not send a email for users (register and forgot-password situations). The emails are being send to [Mailtrap](https://mailtrap.io/), a free service. Please, create an account there and use the configuration for integration on `nodemailer`. You have to change for your own data on *`src/lib/mailer.js`*.

8. After installing the packages, run the command `npm start` to start the server. This will keep running until you end the application (Ctrl + C) or close the window that is running. It will not run in the background, so you need to keep the window open. This application uses the port `:5000` (and `:3000` if you're using nodemon or `:9229` for debugging), so be careful to not have another application trying to run on the same port.

9. Enjoy the application!

## :warning: Rocketseat
### If you're part of Rocketseat Team, please read the following text, it contains some important information regarding this project 

This project follows all the prerequisites from the challenges and exercises on the course. But I took the liberty of adding some other functionalities that I think increments a little bit the user experience. Some are minor changes and other add more pages or change the initial rules. Some of them are:

* Search box for chefs when on chefs page;
* Added back button on forgot password page;
* Added icons in both login and forgot password pages;
* Added a first login page, for setting your password;
* Added transitions for most of the buttons;
* When not an admin, some buttons hide (or change) on the admin area, as the chefs button being hidden (since a regular user can't add, modify or delete a chef) and the users button being changed to "Account" (since the regular user can only edit its own account);
* Added the Base.js in models, with common functions for other models;
* Added a some default images for the seed file. These images are not deleted even when the user, recipe or chef is deleted;
* Added animations when creating a user (success or error/fail).

In my point of view, these changes are for better improving the application and are not intended to substitute any other requirement from this challenge.

## :cop: Remarks

Please notice that this project was made during a bootcamp for better understanding the concepts of the node.js, javascript and web development.

This is not a deploy version of the application and may have some bugs and errors. The whole purpose of this code is for learning and I do not have any guaranty if you want to deploy or use it commercially.

## :handshake: Thanks

I want to thank the Rocketseat team for making this amazing bootcamp, full of videos, exercises and challenges. I learned so much during these weeks, both with the subjects being taught as well as the community that is always helping each other. If anyone wants to learn more about them, the link for their website is [this](https://rocketseat.com.br/). Please notice that the subjects are taught in portuguese (BR).

## :memo: LICENSE

This project is under the MIT License. For more information, please refer to [LICENSE](LICENSE).
