const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

app.use(morgan('dev'))
app.use(methodOverride())
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<script>alert("let move url to /api/v0/{parameter}");</script>')
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
  res.header('Access-Control-Allow-Credentials', true)

  next()
})

module.exports = app