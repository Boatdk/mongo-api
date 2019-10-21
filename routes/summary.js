const express = require('express')
const router = express.Router()
const db = require('../utils/query')

router.route('/v0.1/summary')

  .get((req, res) => {
    const totalDeposit_staff = `SELECT SUM(amount_current) AS total_joker_deposit, COUNT(*) AS total_deposit 
    FROM deposit_log WHERE agent = 'Nikigame' AND status = '1'
    AND (create_date BETWEEN '".date("Y-m-d")." 00:00:00' AND '".date("Y-m-d")." 23:59:59')
    AND create_by = 'staff'`

    const totalDeposit_system = `SELECT SUM(amount_current) AS total_joker_deposit, COUNT(*) AS total_deposit 
    FROM deposit_log WHERE agent = 'Nikigame' AND status = '1'
    AND (create_date BETWEEN '".date("Y-m-d")." 00:00:00' AND '".date("Y-m-d")." 23:59:59')
    AND create_by = 'system'`

    const totalWithdraw_staff = `SELECT SUM(amount) AS total_joker_withdraw, COUNT(*) AS total_withdraw
    FROM withdraw_log WHERE agent = 'wallet' AND status = '1'
    AND (create_date BETWEEN '".date("Y-m-d")." 00:00:00' AND '".date("Y-m-d")." 23:59:59')
    AND create_by = 'staff'`

    const totalWithdraw_system = `SELECT SUM(amount) AS total_joker_withdraw, COUNT(*) AS total_withdraw 
    FROM withdraw_log WHERE agent = 'wallet' AND status = '1'
    AND (create_date BETWEEN '".date("Y-m-d")." 00:00:00' AND '".date("Y-m-d")." 23:59:59')
    AND create_by = 'system'`

    db(totalDeposit_staff).then(depositStaff => {
      db(totalDeposit_system).then(depositSystem => {
        db(totalWithdraw_staff).then(withdrawStaff => {
          db(totalWithdraw_system).then(withdrawSystem => {
            if(depositStaff && depositSystem && withdrawStaff && withdrawSystem){
              var deposit = parseFloat(depositStaff[0].total_joker_deposit) + parseFloat(depositSystem[0].total_joker_deposit)
              var countDeposit = parseInt(depositStaff[0].total_deposit) + parseInt(depositSystem[0].total_deposit)
              var withdraw = parseFloat(withdrawStaff[0].total_joker_withdraw) + parseFloat(withdrawSystem[0].total_joker_withdraw)
              var countWithdraw = parseInt(withdrawStaff[0].total_withdraw) + parseInt(withdrawSystem[0].total_withdraw)
              res.json({
                deposit: deposit,
                count_deposit: countDeposit,
                withdraw: withdraw,
                count_withdraw: countWithdraw
              })
            }
          })
        })
      })
    })
  })

module.exports = router