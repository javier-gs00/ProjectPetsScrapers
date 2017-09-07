const admin = require('express').Router()
const tiendas = require('./tiendas')

admin.get('/', function (req, res) {
    res.render('paneldecontrol')
})

admin.use('/tiendas', tiendas)

module.exports = admin