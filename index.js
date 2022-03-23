const res = require('express/lib/response');
const inquirer = require('inquirer');
const express = require('express');
const app = express();
const mysql = require("mysql2");
require('console.table');

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

function initialMenu () {
    inquirer.prompt([
        {
         type: 'list',
         name: 'menu',
         message: 'What would you like to do? Select one:',
         choices: ['View all employees:', 'view all departments', 'view all roles', 'add an employee', 'add a department', 'add a role', 'update and employee', 'quit']    
        }
    ]).then(results => {
        let choice = results.menu
        switch(choice){
            case "view all employees":
                viewEmployees();
                break;
                
            case "view all departments":
            console.log('IS THIS WORKING')    
            viewDepartments();
                break;
                
            case "view all roles":
                viewEmployees();
                break;
                
            case "add an employee":
                viewEmployees();
                break;
                
            case "add a department":
                viewEmployees();
                break;
                
            case "update and employee":
                viewEmployees();
                break;
            case "quit":
                viewEmployees();
                break;
                
        }
    })
}

function viewEmployees() {
// Get all employees
app.get('/api/employees', (req, res) => {
    const sql = `SELECT * FROM employee`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        console.log(rows)
        return;
    }
    res.json({
        message: 'success',
        data: rows,
    });
    });
  });
};


function viewDepartments() {
    const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
  initialMenu();
}

initialMenu();
