const admin = require('express').Router()
const tiendas = require('./tiendas')
const scrapers = require('./scrapers')
const usuarios = require('./usuarios')

admin.get('/', function (req, res) {
    res.render('paneldecontrol')
})

admin.use('/tiendas', tiendas)

admin.use('/scrapers', scrapers)

admin.use('/usuarios', usuarios)

module.exports = admin