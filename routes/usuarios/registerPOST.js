const validator = require('validator')
const mongoose = require('mongoose')
const UserModel = require('../../dbmodels/user.js').UserModel

module.exports = function (req, res) {

    let errors = []

    let errObj = {
        usernameErr: '',
        noUsername: '',
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
        email = validator.normalizeEmail(email)

        if (validator.isEmail(email) == false) {
            errObj.emailErr = 'Debe ingresar un correo electronico en el formato "ejemplo@correo.com"'
        }
        
        UserModel.find({email: email}, function (err, result) {
            if (Object.keys(result).length !== 0) {
                errObj.emailUsed = 'Este email ya se encuentra registrado. Favor ingresar otro email'
            }

            // USERNAME CHECK
            if (req.body.username) {
                username = validator.trim(req.body.username)

                if (validator.isLength(username, { min:4, max:15 }) == false) {
                    errObj.usernameErr = 'El nombre de usuario debe contener entre 4 y 15 caracteres'
                }
            } else {
                errObj.noUsername = 'Favor ingresar un nombre de usuario'
            }

            // PASSWORD CHECK
            if (req.body.password) {
                password = req.body.password
                passwordMatch = req.body.passwordMatch

                if (validator.isLength(password, { min: 8, max: 100 }) == false) {
                    errObj.passErr1 = 'La contraseña debe tener al menos 8 caracteres'
                }

                if (validator.matches(password, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i") == false) {
                    errObj.passErr2 = 'La contraseña debe contener al menos una mayuscula, una minuscula, un número y un caracter especial'
                }

                if (password !== passwordMatch) {
                    errObj.passErr3 = 'Las contraseñas no coinciden'
                }
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
                let newUser = new UserModel({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password
                })
            
                newUser.save(function (err, newUser) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log('DB INSERT User with username: ' + newUser.username)
                        res.redirect('/usuarios/login')
                    }
                })
            }      
        })
    } else {
        errors = [{ msg: 'Favor completar los campos requeridos'}]
        res.render('user_registration', { errors: errors })
    }
}