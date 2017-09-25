const express = require('express')
// const { check, validationResult } = require('express-validator/check')

module.exports = [
    check('username', 'El nombre de usuario debe contener entre 4 y 15 caracteres').isLength({ min: 4, max: 15 }),
    check('email', 'Debe ingresar un correo electronico en el formato "ejemplo@correo.com"').isEmail(),
    check('password', 'La contraseña debe tener al menos 8 caracteres').isLength({ min: 8, max: 100}),
    check('password', 'La contraseña debe contener al menos una mayuscula, una minuscula, un número y un caracter especial')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    check('passwordMatch', 'Las contraseñas no coinciden. Por favor intentelo nuevamente')
        .custom(function (value, {req}) {return value === req.body.password})
]