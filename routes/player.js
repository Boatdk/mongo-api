const express = require('express')
const router = express.Router()
const db = require('../utils/query')

router.route('/v0.1/player')

  .get(async (req, res) => {
    var query = req.query
    var id = query.id
    console.log("id ===> " + id)
    var getPlayer
    if (query) {
      getPlayer = `SELECT * FROM player WHERE login_id = ${id}`
    } else {
      getPlayer = `SELECT * FROM player`
    }
    console.log(getPlayer)
    db(getPlayer).then(player => {
      if(player){
        res.json({
          data: player,
          status: 1
        })
      }else{
        res.json({
          message: "dont have account",
          status: 0
        })
      }
      
    })
  })

module.exports = router