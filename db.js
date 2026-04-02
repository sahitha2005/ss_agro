const mysql = require('mysql2');

const pool = mysql.createPool({
    host: '127.0.0.1',    // Using 127.0.0.1 is more reliable for XAMPP than 'localhost'
    port: 3307,           // Pointing to your specific XAMPP MySQL port
    user: 'root',         // Default XAMPP username
    password: '',         // Default XAMPP password is an empty string
    database: 'foreign_veg_store',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
