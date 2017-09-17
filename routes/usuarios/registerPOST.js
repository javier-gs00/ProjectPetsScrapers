const UserModel = require('../../dbmodels/user.js').UserModel
const { check, validationResult } = require('express-validator/check')

module.exports = function (req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.render('user_registration', {
            errors: errors.mapped()
        })
    }

    let newUser = new UserModel({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })

    newUser.save(function (err, newUser) {
        if (err) {
            console.log(err)
        } else{
            console.log('DB INSERT User with username: ' + newUser.username)
            res.redirect('/usuarios/login')
        }
    })
}