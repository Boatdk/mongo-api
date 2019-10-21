const express = require('express')
const router = express.Router()
const db = require('../utils/query')

router.route('/v0.1/summary')

  .get((req, res) => {
    var totalDeposit_staff = `SELECT SUM(amount_current) AS total_joker_deposit, COUNT(*) AS total_deposit 
    FROM deposit_log WHERE agent = 'Nikigame' AND status = '1'
    AND (create_date BETWEEN '".date("Y-m-d")." 00:00:00' AND '".date("Y-m-d")." 23:59:59')
    AND create_by = 'staff'`

    var totalDeposit_system = `SELECT SUM(amount_current) AS total_joker_deposit, COUNT(*) AS total_deposit 
    FROM deposit_log WHERE agent = 'Nikigame' AND status = '1'
    AND (create_date BETWEEN '".date("Y-m-d")." 00:00:00' AND '".date("Y-m-d")." 23:59:59')
    AND create_by = 'system'`

    db(totalDeposit_staff).then(staff => {
      db(totalDeposit_system).then(system => {
        
        console.log("staff => " + staff[0].total_joker_deposit + "  ///  " + system[0].total_joker_deposit)
      })
    })
  })

  module.exports = router