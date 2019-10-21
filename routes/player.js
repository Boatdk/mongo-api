const express = require('express')
const router = express.Router()
const db = require('../utils/query')

router.route('/v0.1/player')

  .get(async (req, res) => {
    var query = req.query
    var id = query.id
    var getPlayer
    if (id) {
      getPlayer = `SELECT * FROM player WHERE login_id = ${id}`
      var getMega = `SELECT * FROM agent_mega888 WHERE player_id = ${id}`
      var getJoker = `SELECT * FROM agent_joker WHERE player_id = ${id}`
      var getMegaFree = `SELECT * FROM agent_mega888_free WHERE player_id = ${id}`
      var getJokerFree = `SELECT * FROM agent_joker_free WHERE player_id = ${id}`
      var depositLog = `SELECT * FROM deposit_log WHERE user_id = ${id} ORDER BY create_date DESC`
      var withdrawLog = `SELECT * FROM withdraw_log WHERE login_id = ${id} ORDER BY create_date DESC`
      var bonusLog = `SELECT * FROM bonus_log WHERE user_id = ${id} ORDER BY create_date DESC LIMIT 100`
      var creditLog = `SELECT * FROM credit_code_log WHERE user_id = ${id} ORDER BY create_date DESC`
      var transferLog = `SELECT * FROM transfer_log WHERE login_id = ${id} ORDER BY create_date DESC LIMIT 100`
      var promotion = `SELECT * FROM promotion`
      db(getPlayer).then(player => {
        if (player != '') {
          console.log("===== player information =====")

          db(getMega).then(mega => {
            db(getJoker).then(joker => {
              db(getMegaFree).then(megaF => {
                db(getJokerFree).then(jokerF => {
                  db(depositLog).then(depositLog => {
                    db(withdrawLog).then(withdrawLog => {
                      db(bonusLog).then(bonusLog => {
                        db(creditLog).then(creditLog => {
                          db(promotion).then(promotion => {
                            db(transferLog).then(transferLog => {
                              if (megaF == '')
                                megaF = '-'
                              if (jokerF == '')
                                jokerF = '-'
                              if (joker == '')
                                joker = '-'
                              if (mega == '')
                                mega = '-'
                              res.json({
                                data: player,
                                mega: mega,
                                joker: joker,
                                megaFree: megaF,
                                jokerFree: jokerF,
                                deposit: depositLog,
                                withdraw: withdrawLog,
                                bonus: bonusLog,
                                creditFree: creditLog,
                                transferLog: transferLog,
                                promotion: promotion,
                                status: 1
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                })
              })
            })
          })

        } else {
          res.json({
            message: "dont have account",
            status: 0
          })
        }

      })
    } else {
      getPlayer = `SELECT * FROM player ORDER BY create_date DESC`
      db(getPlayer).then(player => {
        if (player != '')
          res.json({
            data: player,
            status: 1
          })
        else {
          res.json({
            message: "dont have account",
            status: 0
          })
        }
      })
    }
    console.log(getPlayer)

  })

module.exports = router