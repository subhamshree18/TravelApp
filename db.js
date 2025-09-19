// backend/db.js
const mysql = require("mysql2");

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "appuser",              // replace with your MySQL username
  password: "StrongPassword123!",  // replace with your MySQL password
  database: "kerala_travel", // replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise-based pool for async/await usage
module.exports = pool.promise();