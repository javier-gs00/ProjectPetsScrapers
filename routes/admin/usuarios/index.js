const usuarios = require('express').Router()
const user = require('../../../utils/dbmodels/user.js')
const editarGET = require('./editar_get.js')
const eliminar = require('./eliminar.js')

usuarios.get('/', function (req, res) {
    user.findAll(function (err, user) {
        res.render('user_gestion', {
            user: user
        })
    })
})

usuarios.get('/editar/:id', editarGET)

usuarios.delete('/eliminar/:id', eliminar)

module.exports = usuarios