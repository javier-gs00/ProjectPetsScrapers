const users = require('express').Router()
const registerGET = require('./registerGET')
const registerPOST = require('./registerPOST')
const userCheck = require('../../utils/validation/userCheck')

users.get('/login', function (req, res) {
    res.render('user_login')
})

users.get('/registrar', registerGET)

users.post('/registrar', userCheck, registerPOST)

module.exports = users