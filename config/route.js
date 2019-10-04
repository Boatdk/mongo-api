const mysql = require('mysql')

var con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'nikigame_backend',
  port: '8889'
})

con.connect( function(err) {
  if(err) throw err
  console.log("database is on localhost [phpmyadmin]")
})

module.exports = con