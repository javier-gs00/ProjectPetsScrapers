const tiendas = require('express').Router()
const { check } = require('express-validator/check')
const agregarGET = require('./agregar_get')
const agregarPOST = require('./agregar_post')
const editarGET = require('./editarGET')
const editarPUT = require('./editarPUT')
const eliminar = require('./eliminar')
const StoreModel = require('../../../dbmodels/store.js').StoreModel

// READ and show all stores data for managing porpuses
tiendas.get('/', function (req, res) {
    StoreModel.find().exec(function (req, stores) {
        res.render('tiendas_gestion', {
            store: stores
        })
    })
})

tiendas.get('/agregar', agregarGET)

tiendas.post('/agregar', [
    check('brand_name', 'Debe ingresar el nombre de la empresa').isLength({ min: 1 }),
    check('location_name', 'Debe ingresar el nombre del local').isLength({ min: 1 }),
    check('website', 'El sitio debe estar en el formato http://www.sitio.x').isURL({ protocols: ['http', 'https'] }),
    check('address_street', 'La dirección debe incluir el nombre de la calle y el número').isLength({ min: 2 }),
    check('address_commune', 'La comuna debe contener sólo caracteres y tener un largo mayor a dos caracteres').isAlpha().isLength({ min: 2 }),
    check('address_region', 'La región debe contener solo caracteres y tener un largo mayor a dos caracteres').isAlpha().isLength({ min: 2 }),
    check('phone1', 'El número de telefono principal debe contener al menos nueve números').isNumeric().isLength({ min: 9 }),
    check('phone2', 'El número de telefono secundario debe contener al menos nueve números').isNumeric().isLength({ min: 9 }).optional({ checkFalsy: true }),
    check('email', 'El email debe ser del formato ejemplo@correo.fin').isEmail()
], agregarPOST)

tiendas.get('/editar/:id', editarGET)

tiendas.put('/editar/:id', editarPUT)

tiendas.delete('/eliminar/:id', eliminar)

module.exports = tiendas