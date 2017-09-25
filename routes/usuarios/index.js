const users = require('express').Router()
const registerGET = require('./registerGET')
const registerPOST = require('./registerPOST')
// const userCheck = require('../../utils/validation/userCheck')
// const userSanitize = require('../../utils/validation/userSanitize')
// const { sanitize } = require('express-validator/filter')

users.get('/login', function (req, res) {
    res.render('user_login')
})

users.get('/registrar', registerGET)

users.post('/registrar', registerPOST)

module.exports = users