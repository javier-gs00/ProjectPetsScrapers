const tiendas = require('express').Router()
// const { check } = require('express-validator/check')
const agregarGET = require('./agregar_get')
const agregarPOST = require('./agregar_post')
const editarGET = require('./editarGET')
const editarPUT = require('./editarPUT')
const eliminar = require('./eliminar')
const StoreModel = require('../../../dbmodels/store.js').StoreModel
// const storeCheck = require('../../../utils/validation/storeCheck')

// READ and show all stores data for managing porpuses
tiendas.get('/', function (req, res) {
    StoreModel.find().exec(function (req, stores) {
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