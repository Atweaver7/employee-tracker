const mysql = require("mysql2");

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

  db.connect(function (err) {
      if (err) throw err
  })
  module.exports = db;