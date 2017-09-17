const { check, validationResult } = require('express-validator/check')

module.exports = [
    check('username', 'Debe ingresar un nombre de usuario').isLength({ min: 1 }),
    check('email', 'Debe ingresar un correo electronico en el formato "ejemplo@correo.com"').isEmail(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6})
]