const users = require('express').Router()
const registerGET = require('./registerGET')
const registerPOST = require('./registerPOST')

users.get('/login', function (req, res) {
    res.render('user_login')
})

users.get('/registrar', registerGET)

users.post('/registrar', registerPOST)

module.exports = users