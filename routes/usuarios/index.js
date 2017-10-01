const users = require('express').Router()
const passport = require('passport')
const loginGET = require('./loginGET')
const loginPOST = require('./loginPOST')
const registerGET = require('./registerGET')
const registerPOST = require('./registerPOST')

users.get('/login', loginGET)

users.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/usuarios/login'
}))

users.get('/registrar', registerGET)

users.post('/registrar', registerPOST)

module.exports = users