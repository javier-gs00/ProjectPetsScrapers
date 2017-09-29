const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const UserModel = require('../../utils/dbmodels/user.js').UserModel
const validation = require('../../utils/validation/validation.js')

module.exports = function (req, res) {

    let errors = []

    let errObj = {
        usernameErr: '',
        usernameCharErr: '',
        noUsername: '',
        usernameSanitization: '',
        emailErr: '',
        emailUsed: '',
        noEmail: '',
        passErr1: '',
        passErr2: '',
        passErr3: '',
        noPass: ''
    }

    let username
    let email
    let password
    let passwordMatch

    // EMAIL CHECK
    if (req.body.email) {
        email = validator.trim(req.body.email)
        // email = validator.normalizeEmail(email)
        email = validation.check.normalizeEmail(email)
        
        console.log(email)
        errObj.emailErr = validation.check.email(email, 'Debe ingresar un correo electronico en el formato "ejemplo@correo.com"')
        
        UserModel.find({email: email}, function (err, result) {
            if (Object.keys(result).length !== 0) {
                errObj.emailUsed = 'Este email ya se encuentra registrado. Favor ingresar otro email'
            }

            // USERNAME CHECK
            if (req.body.username) {
                username = validator.trim(req.body.username)
                // let whitelist = validator.whitelist(username, '\\^[a-zA-Z0-9\\]*$/')

                errObj.usernameErr = validation.check.length(username, 4, 15, 'El nombre de usuario debe contener entre 4 y 15 caracteres')

                errObj.usernameCharErr = validation.check.alpha(username, 'es-ES', 'Solo se permiten caracteres del español')
            } else {
                errObj.noUsername = 'Favor ingresar un nombre de usuario'
            }

            // PASSWORD CHECK
            if (req.body.password) {
                password = req.body.password
                passwordMatch = req.body.passwordMatch

                errObj.passErr1 = validation.check.length(password, 8, 100, 'La contraseña debe tener al menos 8 caracteres')

                errObj.passErr2 = validation.check.match(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, 'La contraseña debe contener al menos una mayuscula, una minuscula, un número y un caracter especial')

                errObj.passErr3 = validation.check.equal(password, passwordMatch, 'Las contraseñas no coinciden')
            } else {
                errObj.noPass = 'Favor ingresar una contraseña'
            }

            // POPULATE ERRORS COLLECTION IN ORDER
            for (let i in errObj) {
                if (errObj.hasOwnProperty(i)) {
                    if (errObj[i] !== ''){
                        errors.push({ msg: errObj[i]})
                    }
                }
            }

            if (errors.length > 0) {       
                return res.render('user_registration', {
                    errors: errors,
                    users: {
                        username: username,
                        email: email,
                        password: password,
                        passwordMatch: req.body.passwordMatch
                    }
                })
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        let newUser = new UserModel({
                            username: req.body.username,
                            email: req.body.email,
                            password: hash
                        })
                    
                        newUser.save(function (err, newUser) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log('DB INSERT User with username: ' + newUser.username)
                                
                                req.login(newUser, function (err) {
                                    res.redirect('/')
                                })
                            }
                        })

                    })
                })
            }      
        })
    } else {
        errors = [{ msg: 'Favor completar los campos requeridos'}]
        res.render('user_registration', { errors: errors })
    }
}