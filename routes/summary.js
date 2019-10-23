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

    const staff_scbDeposit = `SELECT SUM(deposit_amount) AS total_scb_deposit, COUNT(*) AS count_deposit 
    FROM scb_log WHERE status = '1'
    AND (datetime BETWEEN '${now} 00:00:00' AND '${now} 23:59:59')
    AND staff = '1'`

    const staff_truewalletDeposit = `SELECT SUM(deposit_amount) AS total_truewallet_deposit, COUNT(*) AS count_deposit 
    FROM truewallet_log WHERE status = '1'
    AND (datetime BETWEEN '${now} 00:00:00' AND '${now} 23:59:59')
    AND staff = '1'`

    const countPlayer = `SELECT COUNT(*) AS count_player FROM player`
    const bonus = `SELECT SUM(amount) AS total_bonus, COUNT(*) AS count_bonus 
    FROM bonus_log WHERE (create_date BETWEEN '${now} 00:00:00' AND '${now} 23:59:59')`


    db(totalDeposit_staff).then(depositStaff => {
      db(totalDeposit_system).then(depositSystem => {
        db(totalWithdraw_staff).then(withdrawStaff => {
          db(totalWithdraw_system).then(withdrawSystem => {
            db(countPlayer).then(countPlayer => {
              db(bonus).then(bonus => {
                db(staff_scbDeposit).then(staffScb => {
                  db(staff_truewalletDeposit).then(staffTruewallet => {
                    if (depositStaff && depositSystem && withdrawStaff && withdrawSystem) {
                      var deposit_staff = parseFloat(depositStaff[0].total_deposit)
                      var deposit_system = parseFloat(depositSystem[0].total_deposit)
                      var withdraw_staff = parseFloat(withdrawStaff[0].total_withdraw)
                      var withdraw_system = parseFloat(withdrawSystem[0].total_withdraw)
                      var mn_scb = parseFloat(staffScb[0].total_scb_deposit)
                      var mn_truewallet = parseFloat(staffTruewallet[0].total_truewallet_deposit) 

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
                      if (bonus[0].total_bonus == null) {
                        bonus[0].total_bonus = 0
                      }
                      if(staffScb[0].total_scb_deposit == null){
                        mn_scb = 0
                      }
                      if(staffTruewallet[0].total_truewallet_deposit == null){
                        mn_truewallet = 0
                      }
                      var deposit = deposit_staff + deposit_system
                      var countDeposit = parseInt(depositStaff[0].count_deposit) + parseInt(depositSystem[0].count_deposit)
                      var withdraw = withdraw_staff + withdraw_system
                      var countWithdraw = parseInt(withdrawStaff[0].count_withdraw) + parseInt(withdrawSystem[0].count_withdraw)
                      var mn_deposit = mn_scb + mn_truewallet
                      var mn_count = staffScb[0].count_deposit + staffTruewallet[0].count_deposit
                      var mn_withdraw = withdraw_staff
                      res.json({
                        deposit: {
                          total_deposit: deposit,
                          count_deposit: countDeposit,
                          auto_deposit: deposit_system,
                          count_autoDeposit: depositSystem[0].count_deposit,
                          manual_deposit: mn_deposit,
                          count_mnDeposit: mn_count
                        },
                        withdraw: {
                          total_withdraw: withdraw,
                          count_withdraw: countWithdraw,
                          auto_withdraw: withdraw_system,
                          count_autowithdraw: withdrawSystem[0].count_withdraw,
                          manual_withdraw: mn_withdraw,
                          count_mnWithdraw: withdrawStaff[0].count_withdraw
                        },
                        total_player: countPlayer[0].count_player,
                        bonus: bonus[0],
                      })
                    }
                  })
                })
              })
            })
          })
        })
      })
    })
  })

module.exports = router