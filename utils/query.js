const con = require('../config/route')

const query = (sql) => {
  return new Promise(function(resolve, reject) {
    con.query(sql, function(err, result){
      if(err) reject(err)
      resolve(result)
    })
  })
}

module.exports = query