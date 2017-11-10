const users = require('express').Router()
const passport = require('passport')
const loginGET = require('./login_get')
const loginPOST = require('./login_post')
const registerGET = require('./register_get')
const registerPOST = require('./register_post')

users.get('/login', loginGET)

users.post('/login', loginPOST)

// users.post('/login', passport.authenticate('local', {
//     successRedirect: '/admin',
//     failureRedirect: '/usuarios/login'
// }))

users.get('/registrar', registerGET)

users.post('/registrar', registerPOST)

module.exports = users