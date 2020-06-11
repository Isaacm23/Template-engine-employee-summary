const Manager = require("./Develop/lib/Manager");
const Engineer = require("./Develop/lib/Engineer");
const Intern = require("./Develop/lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./Develop/lib/htmlRenderer");
function createEmployee() {
	inquirer
		.prompt(questions.empQuestions)
		.then(answers => {
			switch (answers.role) {
				case "Engineer":
					inquirer.prompt(questions.engQuestion).then(engineerAnswers => {
						const engineerData = new Engineer(
							answers.name,
							answers.id,
							answers.email,
							engineerAnswers.github
						);
						readEngFile(engineerData);

						restartInquirer();
					});
					break;
				case "Manager":
					inquirer.prompt(questions.mgmtQuestion).then(async managerAnswers => {
						const managerData = await new Manager(
							answers.name,
							answers.id,
							answers.email,
							managerAnswers.officeNumber
						);
						readMgnFile(managerData);

						restartInquirer();
					});
					break;
				case "Intern":
					inquirer
						.prompt(questions.internQuestion)
						.then(async internAnswers => {
							const internData = await new Intern(
								answers.name,
								answers.id,
								answers.email,
								internAnswers.internSchool
							);
							readInternFile(internData);

							restartInquirer();
						});
					break;
			}
		})
		.catch(err => {
			throw err;
		});
}

function restartInquirer() {
	inquirer.prompt(questions.newQuestion).then(answer => {
		switch (answer.role) {
			case "YES!!!":
				createEmployee();
				break;

			case "NOPE, THATS EVERYONE!":
				createHTML();
				break;
		}
	});
}

// working
function readEngFile(engineerData) {
	// console.log(engineerData);
	// data is my html string,
	const icon = `<i class="fas fa-glasses fa-2x"></i>`;
	fs.readFile("./html/engineer.html", "utf8", function(error, data) {
		// console.log(engineerData.name);
		const newData = data
			.replace("Ename:", engineerData.name)
			.replace("Eicon:", icon)
			.replace("Eid", engineerData.id)
			.replace("Eemail", engineerData.email)
			.replace("Egighub", engineerData.github);

		// read .html for all class values and the combine them before writing the file.
		html += newData;
		// console.log(html);
	});
}
// not working
function readMgnFile(managerData) {
	// data is my html string,
	const icon = `<i class="far fa-chart-bar fa-2x"></i>`;
	fs.readFile("./html/manager.html", "utf8", function(error, data) {
		const newData = data
			.replace("Mname:", managerData.name)
			.replace("Micon:", icon)
			.replace("Mid", managerData.id)
			.replace("Memail", managerData.email)
			.replace("Mphone", managerData.officeNumber);

		// read .html for all class values and the combine them before writing the file.
		html += newData;
	});
}
// not working
function readInternFile(internData) {
	// data is my html string,
	const icon = `<i class="fas fa-eye fa-2x"></i>`;
	fs.readFile("./html/intern.html", "utf8", function(error, data) {
		const newData = data
			.replace("Iname:", internData.name)
			.replace("Iicon:", icon)
			.replace("Iid", internData.id)
			.replace("Iemail", internData.email)
			.replace("Ischool", internData.internSchool);

		// read .html for all class values and the combine them before writing the file.
		html += newData;
	});
}

function createHTML() {
	fs.readFile("./html/main.html", "utf8", (err, data) => {
		const newData = data.replace("{{html}}", html);

		fs.writeFile("./output/index.html", newData, "utf8", err => {
			if (err) return console.log(err);
		});
		console.log(".html created");
	});
}

module.exports = {};

createEmployee();

