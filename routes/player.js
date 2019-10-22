const express = require('express')
const router = express.Router()
const db = require('../utils/query')

router.route('/v0.1/player')

  .get(async (req, res) => {
    var query = req.query
    var id = query.id
    var getPlayer
    if (id) {
      getPlayer = `SELECT * FROM player WHERE login_id = '${id}'`
      var getNiki = `SELECT * FROM agent_niki WHERE player_id = '${id}'`
      var getMega = `SELECT * FROM agent_mega888 WHERE player_id = '${id}'`
      var getJoker = `SELECT * FROM agent_joker WHERE player_id = '${id}'`
      var getMegaFree = `SELECT * FROM agent_mega888_free WHERE player_id = '${id}'`
      var getJokerFree = `SELECT * FROM agent_joker_free WHERE player_id = '${id}'`
      var depositLog = `SELECT * FROM deposit_log WHERE user_id = '${id}' ORDER BY create_date DESC`
      var withdrawLog = `SELECT * FROM withdraw_log WHERE login_id = '${id}' ORDER BY create_date DESC`
      var bonusLog = `SELECT * FROM bonus_log WHERE user_id = '${id}' ORDER BY create_date DESC LIMIT 100`
      var creditLog = `SELECT * FROM credit_code_log WHERE user_id = '${id}' ORDER BY create_date DESC`
      var transferLog = `SELECT * FROM transfer_log WHERE login_id = '${id}' ORDER BY create_date DESC LIMIT 100`
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
                              db(getNiki).then(niki => {
                                res.json({
                                  data: player,
                                  niki: niki,
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

  })

router.route('/v0.1/block')

  .post((req, res) => {
    const body = req.body
    var id = body.id
    var token = body.token
    var validBlock = `SELECT * FROM player WHERE login_id = ${id}`
    db(validBlock).then(data => {
      var validToken = data[0].token
      var validId = data[0].login_id
      if (token == validToken && id == validId) {
        var blockPlayer = `UPDATE player SET status = 0 WHERE token = '${token}'`
        console.log(blockPlayer)
        db(blockPlayer).then(result => {
          if (result.protocol41) {
            res.json({
              status: 1,
              message: "update successfully"
            })
          }else{
            res.json({
              status: 0,
              message: "update fail"
            })
          }
        })
      }else{
        res.json({
          message: "Dont have this account or Invalid token"
        })
      }
    })
  })

router.route('/v0.1/unblock')

  .post((req, res) => {
    const body = req.body
    var id = body.id
    var token = body.token
    var validPlayer = `SELECT * FROM player WHERE login_id = ${id}`
    db(validPlayer).then(data => {
      var validToken = data[0].token
      var validId = data[0].login_id
      if (token == validToken && id == validId){
        var unblockPlayer = `UPDATE player SET status = 1 WHERE token = '${token}'`
        db(unblockPlayer).then(result => {
          if(result.protocol41){
            res.json({
              status: 1,
              message: "unblock successfully"
            })
          }else{
            res.json({
              status: 0,
              message: "Error"
            })
          }
        })
      }else{
        res.json({
          message: "Dont have this account or Invalid token"
        })
      }
    })
  })


module.exports = router