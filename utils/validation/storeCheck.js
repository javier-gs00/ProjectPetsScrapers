const { check, validationResult } = require('express-validator/check')

module.exports = [
    check('brand_name', 'Debe ingresar el nombre de la empresa').isLength({ min: 1 }),
    check('location_name', 'Debe ingresar el nombre del local').isLength({ min: 1 }),
    check('website', 'El sitio debe estar en el formato http://www.sitio.x').isURL({ protocols: ['http', 'https'] }),
    check('address_street', 'La dirección debe incluir el nombre de la calle y el número').isLength({ min: 2 }),
    check('address_commune', 'La comuna debe contener sólo caracteres y tener un largo mayor a dos caracteres').isLength({ min: 2 }),
    check('address_region', 'La región debe contener sólo caracteres y tener un largo mayor a dos caracteres').isLength({ min: 2 }),
    check('phone1', 'El número de telefono principal debe contener al menos nueve números').isNumeric().isLength({ min: 9 }),
    check('phone2', 'El número de telefono secundario debe contener al menos nueve números').isNumeric().isLength({ min: 9 }).optional({ checkFalsy: true }),
    check('email', 'El email debe ser del formato ejemplo@correo.com').isEmail()
]