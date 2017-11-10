const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const Users = require('../../utils/dbmodels/user.js')
const validation = require('../../utils/validation/validation.js')
const formidable = require('formidable')

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

    let form = new formidable.IncomingForm()

    form.parse(req, function (err, fields, files) {
        let username
        let email
        let password
        let passwordMatch

        // EMAIL CHECK
        if (fields.email) {
            email = validator.trim(fields.email)
            // email = validator.normalizeEmail(email)
            email = validation.check.normalizeEmail(email)

            errObj.emailErr = validation.check.email(email, 'Debe ingresar un correo electronico en el formato "ejemplo@correo.com"')
            console.log('---------------- Email: ----------------')
            console.log(email)
            Users.findByEmail(email, function (err, result) {
                console.log('---------------- Result: ----------------')
                console.log(result)
                if (err) { console.log(err); next()}
                if (result === 0) {
                    errObj.emailUsed = 'Este email ya se encuentra registrado. Favor ingresar otro email'
                }

                // USERNAME CHECK
                if (fields.username) {
                    username = validator.trim(fields.username)
                    // let whitelist = validator.whitelist(username, '\\^[a-zA-Z0-9\\]*$/')

                    errObj.usernameErr = validation.check.length(username, 4, 15, 'El nombre de usuario debe contener entre 4 y 15 caracteres')

                    errObj.usernameCharErr = validation.check.alpha(username, 'es-ES', 'El nombre de usuario sólo caracteres del español')
                } else {
                    errObj.noUsername = 'Favor ingresar un nombre de usuario'
                }

                // PASSWORD CHECK
                if (fields.password) {
                    password = fields.password
                    passwordMatch = fields.passwordMatch

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
                            passwordMatch: fields.passwordMatch
                        }
                    })
                } else {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(fields.password, salt, function (err, hash) {

                            Users.save(fields.username, hash, fields.email, function (err, newUser) {
                                console.log('DB INSERT User with username: ' + newUser.username)
                                
                                req.login(newUser, function (err) {
                                    res.redirect('/')
                                })
                            })
                        })
                    })
                }    
            })
        } else {
            errors = [{ msg: 'Favor completar los campos requeridos'}]
            res.render('user_registration', { errors: errors })
        }

    })
}