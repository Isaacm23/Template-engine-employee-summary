const Manager = require("./Develop/lib/Manager");
const Engineer = require("./Develop/lib/Engineer");
const Intern = require("./Develop/lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

run();

// main function
async function run() {
    let cont = true;
    const employees = [];

    //while loop which gathers employees until the user is finished
    while (cont === true) {
        const employeeType = await inquirer.prompt({
            type: "list",
            name: "employeeType",
            message: "What type of employee would you like to add?",
            choices: ["Engineer", "Intern", "Manager"]
        })
        const newEmployee = generateEmployee(employeeType.employeeType, await inquirer.prompt(generateQuestions(employeeType.employeeType)));
        employees.push(newEmployee);

        const userCont = await inquirer.prompt({
            type: "confirm",
            name: "cont",
            message: "Would you like to add another employee?"
        })
        cont = userCont.cont;
    }

    const HTML = render(employees);

    //checks if filepath exists, and creates it if it doesnt
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    fs.writeFile(outputPath, HTML, err => {
        if (err) {
            throw err;
        }
        console.log("File Created!")
    });
}

// takes data from inquirer and creates a new object using our employee subclasses
function generateEmployee(employeeType, data) {
    let newEmployee;
    
    switch (employeeType) {
        case "Engineer":
            newEmployee = new Engineer(data.name, data.id, data.email, data.github);
            break;
        case "Intern":
            newEmployee = new Intern(data.name, data.id, data.email, data.school);
            break;
        case "Manager":
            newEmployee = new Manager(data.name, data.id, data.email, data.officeNumber);
            break;
    }

    return newEmployee;
}

// uses role argument to genereate the questions for each type of employee
function generateQuestions(employeeType) {
    const questions = [
        {
            type: "input",
            name: "name",
            message: "Enter the employee's name: "
        },
        {
            type: "input",
            name: "id",
            message: "Enter the employee's id number: "
        },
        {
            type: "input",
            name: "email",
            message: "Enter the employee's email address: "
        }
    ]

    switch (employeeType) {
        case "Engineer":
            questions.push({
                type: "input",
                name: "github",
                message: "Enter the engineer's GitHub account name: "
            });
            break;
        case "Intern":
            questions.push({
                type: "input",
                name: "school",
                message: "Enter the intern's school: "
            });
            break;
        case "Manager":
            questions.push({
                type: "input",
                name: "officeNumber",
                message: "Enter the manager's office number: "
            });
    }

    return questions;
}

