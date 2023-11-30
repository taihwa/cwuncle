var mysql = require('mysql');

var pool = mysql.createPool({
    host : 'localhost',
    user : 'cwuncle',
    password : 'hwa30102##',
    database : 'cwuncle',
    port: 3316
});

module.exports = pool;