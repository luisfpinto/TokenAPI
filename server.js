var express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  config = require('./config'), // get our config file
  User = require('./user') // get our mongoose model

// Connect to the database
const port = process.env.PORT || 8080
mongoose.connect(config.database)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Log request on the console
app.use(morgan('dev'))

app.get('/', function (req, res) {
  res.status(200).send('Hello World')
})

// Create User on the database
app.get('/setup', function (req, res) {
  var userName = new User({
    name: 'Luis',
    password: 'password',
    admin: true
  })

  userName.save(function (err) {
    if (err) throw err
    console.log('User saved')
    res.status(200).send()
  })
})

// API  Router
var router = require('./router')
app.use('/api', router)

app.listen(port, function () {
  console.log('Server is running on localhost:' + port)
})

module.exports = app
