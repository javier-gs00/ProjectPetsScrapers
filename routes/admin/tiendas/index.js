const tiendas = require('express').Router()
const agregarGET = require('./agregar_get')
const agregarPOST = require('./agregar_post')
const editarGET = require('./editar_get')
const editarPUT = require('./editar_put')
const eliminar = require('./eliminar')
const Stores = require('../../../utils/dbmodels/store.js')

// READ and show all stores data for managing porpuses
tiendas.get('/', function (req, res) {
    Stores.findAll(function(req, stores) {
        res.render('tiendas_gestion', {
            store: stores
        })
    })
})

tiendas.get('/agregar', agregarGET)

tiendas.post('/agregar', agregarPOST)

tiendas.get('/editar/:id', editarGET)

tiendas.put('/editar/:id', editarPUT)

tiendas.delete('/eliminar/:id', eliminar)

module.exports = tiendas