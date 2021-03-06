const app = require('./app')
const port = 7777
const user = require('./routes/user')
const player = require('./routes/player')
const summary = require('./routes/summary')

app.use('/api', user)
app.use('/api', player)
app.use('/api', summary)

// mongoose.Promise = global.Promise
// const url = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-mvcy8.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
//   app.listen(port)
//   console.log('connect to database & server on port:' + port)
// }).catch(err => {
//   console.log(err)
// })

var server = app.listen(port, ()=> {
  console.log('server is on port: 7777')
})