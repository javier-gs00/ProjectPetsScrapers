const admin = require('express').Router()
const tiendas = require('./tiendas')
const scrapers = require('./scrapers')

admin.get('/', function (req, res) {
    res.render('paneldecontrol')
})

admin.use('/tiendas', tiendas)

admin.use('/scrapers', scrapers)

module.exports = admin