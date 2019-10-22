const express = require('express')
const router = express.Router()
const db = require('../utils/query')

router.route('/v0.1/summary')

  .get((req, res) => {

    var date = new Date()
    var now = date.toISOString().split('T')[0]
    console.log(now)
    const totalDeposit_staff = `SELECT SUM(amount_current) AS total_deposit, COUNT(*) AS count_deposit 
    FROM deposit_log WHERE agent = 'Nikigame' AND status = '1'
    AND (create_date BETWEEN '${now} 00:00:00' AND '${now} 23:59:59')
    AND create_by = 'staff'`

    const totalDeposit_system = `SELECT SUM(amount_current) AS total_deposit, COUNT(*) AS count_deposit 
    FROM deposit_log WHERE agent = 'Nikigame' AND status = '1'
    AND (create_date BETWEEN '${now} 00:00:00' AND '${now} 23:59:59')
    AND create_by = 'system'`
    console.log(totalDeposit_system)

    const totalWithdraw_staff = `SELECT SUM(amount) AS total_withdraw, COUNT(*) AS count_withdraw
    FROM withdraw_log WHERE agent = 'wallet' AND status = '1'
    AND (create_date BETWEEN '${now} 00:00:00' AND '${now} 23:59:59')
    AND create_by = 'staff'`

    const totalWithdraw_system = `SELECT SUM(amount) AS total_withdraw, COUNT(*) AS count_withdraw 
    FROM withdraw_log WHERE agent = 'wallet' AND status = '1'
    AND (create_date BETWEEN '${now} 00:00:00' AND '${now} 23:59:59')
    AND create_by = 'system'`

    db(totalDeposit_staff).then(depositStaff => {
      db(totalDeposit_system).then(depositSystem => {
        db(totalWithdraw_staff).then(withdrawStaff => {
          db(totalWithdraw_system).then(withdrawSystem => {
            if (depositStaff && depositSystem && withdrawStaff && withdrawSystem) {
              var deposit_staff = parseFloat(depositStaff[0].total_deposit)
              var deposit_system = parseFloat(depositSystem[0].total_deposit)
              var withdraw_staff = parseFloat(withdrawStaff[0].total_withdraw)
              var withdraw_system = parseFloat(withdrawSystem[0].total_withdraw)
              if (depositStaff[0].total_deposit == null) {
                deposit_staff = 0
              }
              if (depositSystem[0].total_deposit == null) {
                deposit_system = 0
              }
              if (withdrawStaff[0].total_withdraw == null) {
                withdraw_staff = 0
              }
              if (withdrawSystem[0].total_withdraw == null) {
                withdraw_system = 0
              }
              var deposit = deposit_staff + deposit_system
              var countDeposit = parseInt(depositStaff[0].count_deposit) + parseInt(depositSystem[0].count_deposit)
              var withdraw = withdraw_staff + withdraw_system
              var countWithdraw = parseInt(withdrawStaff[0].count_withdraw) + parseInt(withdrawSystem[0].count_withdraw)
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