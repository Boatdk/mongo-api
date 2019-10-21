const express = require('express')
const router = express.Router()
const User = require('../model/user')
const jwt = require('jsonwebtoken')
const verify = require('../routes/verifyToken')
const bcrypt = require('bcrypt')
const query = require('../utils/query')
const jwtExpirySeconds = 300

router.route('/user')

  .get(verify, async (req, res) => {
    var query = req.query
    console.log(query)
    try {
      if (!query.username && !query.password) {
        const users = await User.find()
        res.json(users)
      } else {
        const users = await User.find({
          'username': query.username,
          'password': query.password
        })
        if (users == '') {
          res.json({
            data: users,
            status: 0,
          })
        } else {
          const token = jwt.sign({
            username: query.username,
            password: query.password
          }, jwtKey, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
          })
          const updateUser = await User.findOneAndUpdate({
            username: query.username
          }, {
            $set: {
              token: token
            }
          })
          console.log(updateUser)
          res.json({
            data: users,
            status: 1
          })
        }
      }
    } catch (err) {
      res.status(500).json({
        message: err.message
      })
    }
  })

  .post(async (req, res) => {
    var body = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const token = await jwt.sign({
      username: body.username,
      password: body.password
    }, process.env.jwtKey, {
      algorithm: 'HS256',
      expiresIn: jwtExpirySeconds
    })
    const users = new User({
      username: body.username,
      password: hashedPassword,
      token: token
    })
    const existedUser = await User.find({
      'username': body.username
    })
    console.log(existedUser)
    try {
      if (existedUser == '') {
        const newUser = await users.save()
        res.status(201).json(newUser)
      } else {
        res.json({
          message: "your username is existed"
        })
      }
    } catch (err) {
      res.status(400).json({
        message: err.message
      })
    }
  })

  .put(async (req, res) => {
    var body = req.body
    const updateUsers = await User.findOneAndUpdate({
      '_id': body._id
    }, {
      $set: {
        username: body.username,
        password: body.password
      }
    })
    if (updateUsers) {
      res.json({
        message: "update successfully",
        status: 1
      })
    }

  })

  .delete(async (req, res) => {
    var query = req.query
    const deleteUser = await User.remove({
      _id: query._id
    })
    console.log(deleteUser.deletedCount)
    if (deleteUser.deletedCount == 1) {
      res.json({
        message: 'delete successfully',
        status: 1
      })
    } else {
      res.json({
        message: 'delete fail',
        status: 0
      })
    }

  })


router.route('/login')
  .post(async (req, res) => {
    var body = req.body
    try {
      if (body.username && body.password) {
        const checkLogin = await User.find({
          'username': body.username
        })
        const validPass = await bcrypt.compare(body.password, checkLogin[0].password)
        if (validPass) {
          const token = jwt.sign({
            username: body.username
          }, process.env.jwtKey, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
          })
          const updateUser = await User.findOneAndUpdate({
            username: body.username
          }, {
            $set: {
              token: token
            }
          })
          res.header('auth-token', token).json({
            status: 1
          })

        } else {
          res.json({
            status: 0,
            message: "login error"
          })
        }
      }
    } catch (err) {
      res.status(400).json({
        message: err.message
      })
    }
  })

router.route('/v0.1/register')
  .post(async (req, res) => {
    const body = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(body.password, salt)
    const sql = `INSERT into admin_login(staff_name, username, password) VALUES('${body.username}', '${body.username}', '${hashedPassword}')`
    query(sql).then(resp => {
      res.json({
        data: resp
      })
    })
  })

router.route('/v0.1/login')

  .post(async (req, res) => {
    const body = req.body
    const sql = `SELECT * FROM admin_login WHERE username = '${body.username}'`
    query(sql).then(async resp => {
      const validPass = await bcrypt.compare(body.password, resp[0].password)
      const token = jwt.sign({
        username: body.username
      }, process.env.jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
      })
      if (validPass) {
        const status = `SELECT status FROM admin_login WHERE username = '${body.username}'`
        query(status).then(status => {
          var login = status[0].status
          var date = new Date()
          console.log(date)
          var event = date.toISOString()
          console.log(event)
          if (login != 1) {
            const updateLogin = `UPDATE admin_login SET status = 1, last_login='${event}' WHERE username = '${body.username}'`
            console.log(updateLogin)
            query(updateLogin).then(resp => {
              res.header('auth-token', token).json({
                status: 1,
                username: body.username
              })
            })
          } else {
            res.json({
              status: 2
            })
          }
        })
      } else {
        res.json({
          status: 0
        })
      }
    })

  })

router.route('/v0.1/logout')
  
  .post(async (req, res) => {
    const body = req.body
    const sql = `UPDATE admin_login SET status = 0 WHERE username = '${body.username}'`
    query(sql).then(resp => {
      if(resp){
        res.json({
          message: 'logout!!'
        })
      }
    })
  })


module.exports = router