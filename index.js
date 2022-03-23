const res = require("express/lib/response");
const inquirer = require("inquirer");
const express = require("express");
const router = express.Router();
const app = express();
const mysql = require("mysql2");
const PORT = process.env.PORT || 3002;
let roleArray = [];
let managerArray = [];
require("console.table");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "1088",
    database: "myBusiness",
  },
  console.log("Connected to the employee database.")
);

function initialMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "What would you like to do? Select one:",
        choices: [
          "View all employees:",
          "View all departments",
          "View all roles",
          "Add an employee",
          "Add a department",
          "Add a role",
          "Update an employee",
          "Quit",
        ],
      },
    ])
    .then((results) => {
      let choice = results.menu;
      switch (choice) {
        case "View all employees:":
          viewEmployees();
          break;

        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "Add an employee":
          insertEmployee();
          break;

        case "Add a department":
          addDepartment();
          break;

        case "Update an employee":
          viewEmployees();
          break;
        case "Quit":
          viewEmployees();
          break;
      }
    });
}

// function viewEmployees() {
// db.query("SELECT employee.first_name, employee.last_name, department.name",
// function (err,res) {
//   if (err) throw err
//   console.table(res)
//   initialMenu();
// })
// }

function viewDepartments() {
  db.query(
    "SELECT id, name FROM department",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      initialMenu();
    }
  );
}

function viewRoles() {
  db.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      initialMenu();
    }
  );
}

function viewEmployees() {
  db.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      initialMenu();
    }
  );
}
function managerSelect() {
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerArray.push(res[i].first_name);
      }
    }
  );
  return managerArray;
}

function insertEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Please enter first name of employee you would like to add:",
      },
      {
        name: "lastName",
        type: "input",
        message: "Please enter last name of employee you would like to add:",
      },
      {
        name: "role",
        type: "list",
        message: "Please enter employee's role you would like to add:",
        choices: roleSelect(),
      },
      {
        name: "choice",
        type: "list",
        message: "Who is their manager?",
        choices: managerSelect(),
      },
    ])
    .then((data) => {
      let rolID = roleSelect().indexOf(data.role) + 1;
      let manID = managerSelect().indexOf(data.choice) + 1;
      db.query(
        "INSERT INTO employee SET ?",
        {
          first_name: data.firstName,
          last_name: data.lastName,
          manager_id: manID,
          role_id: rolID,
        },
        function (err) {
          if (err) throw err;
          console.table(data);
          initialMenu();
        }
      );
    });
}

function roleSelect() {
  db.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArray.push(res[i].title);
      console.log(roleArray);
    }
  });
  return roleArray;
}
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What department do you want to add?",
      },
    ])
    .then((data) => {
      db.query("INSERT INTO department SET ?", 
      {
        name: data.departmentName
      },
      function(err) {
        if (err) throw err
        initialMenu();
      }
      );
    });
}

initialMenu();

// employee ids, first names, last names, job titles, departments, salaries,
// and managers that the employees report to
