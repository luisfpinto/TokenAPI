var express = require('express')
var User = require('./user')
var jwt = require('jsonwebtoken') // used to create, sign, and verify tokens
var config = require('./config') // get our config file

var router = express.Router()

// Authenticate users and give them a secret Token
router.post('/authenticate', function (req, res) {
  User.findOne({
    name: req.body.name
  }, function (err, user) {
    if (err) throw err
    if (!user) return res.status(401).send({error: 'User not found'})
    if (user.password !== req.body.password) return res.status(401).send({error: 'Incorrect Password'})
    var token = jwt.sign(user, config.secret, {expiresIn: '1 day'})
    res.json({
      sucess: true,
      message: 'Token Sent',
      token: token
    })
  })
})

// Route middleware to verify a token

router.use(function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) return res.status(401).send({error: 'Failed to authenticate token'})
      req.decoded = decoded
      next()
    })
  } else {
    return res.status(403).send({sucess: false, message: 'No token provided'})
  }
})

// Route shows a random message
router.get('/', function (req, res) {
  res.json('Welcome to the api Router')
})

// Get the users from the database
router.get('/users', function (req, res) {
  User.find({}, function (err, users) {
    if (err) throw err
    res.json(users)
  })
})

module.exports = router
