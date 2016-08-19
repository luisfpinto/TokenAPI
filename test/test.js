var chai = require('chai')
var chaiHttp = require('chai-http')
var server = require('../server.js')

var should = chai.should()
var token = null

chai.use(chaiHttp)

describe('Testing basic routes and creating the user on the database', function() {
  it('should return a Hello World and 200 status', function (done) {
    chai.request(server)
      .get('/')
      .end(function(err, res) {
        res.should.have.status(200)
        res.text.should.equal('Hello World')
        done()
      })
  })
  it('should create and save a user on the database', function (done) {
    chai.request(server)
      .get('/setup')
      .end(function(err, res) {
        res.should.have.status(200)
        done()
      })
  })
})

describe('Testing authentication route', function () {
  it('should return a token', function (done) {
    chai.request(server)
      .post('/api/authenticate')
      .send({name: 'Luis', password: 'password'})
      .end(function(err, res) {
        res.body.message.should.equal('Token Sent')
        token = res.body.token
        done()
      })
  })
  it('should return user not found', function (done) {
    chai.request(server)
      .post('/api/authenticate')
      .send({name: 'Luisss', password: 'password'})
      .end(function(err, res) {
        res.body.error.should.equal('User not found')
        res.should.have.status(401)
        done()
      })
  })
  it('should return incorrect password', function (done) {
    chai.request(server)
      .post('/api/authenticate')
      .send({name: 'Luis', password: 'passworddd'})
      .end(function(err, res) {
        res.body.error.should.equal('Incorrect Password')
        res.should.have.status(401)
        done()
      })
  })
})

describe('Testing Router without token', function () {
  it('should return no token provided', function (done) {
    chai.request(server)
      .get('/api')
      .end(function(err, res) {
        res.body.message.should.equal('No token provided')
        res.should.have.status(403)
        done()
      })
  })
  it('should return failed to authenticate token', function (done) {
    chai.request(server)
      .get('/api')
      .query({token: '0000'})
      .end(function(err, res) {
        res.body.error.should.equal('Failed to authenticate token')
        res.should.have.status(401)
        done()
      })
  })
})

describe('Testing Router with token', function () {
  it('should return welcome to the api Router', function (done) {
    chai.request(server)
      .get('/api')
      .query({token})
      .end(function(err, res) {
        console.log(res.body)
        res.body.should.equal('Welcome to the api Router')
        done()
      })
  })
  it('should list users', function (done) {
    chai.request(server)
      .get('/api/users')
      .query({token})
      .end(function(err, res) {
        res.body.should.be.a('array')
        done()
      })
  })
})

