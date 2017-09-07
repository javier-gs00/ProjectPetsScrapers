const routes = require('express').Router()
const search = require('./search')
const alimentos = require('./alimentos')
const medicamentos = require('./medicamentos')
const servicios = require('./servicios')
const tiendas = require('./tiendas')
const admin = require('./admin')

// Landing page
routes.get('/', function (req, res) {
    res.render('home')
})

routes.use('/search', search)

routes.use('/alimentos', alimentos)

routes.use('/medicamentos', medicamentos)

routes.use('/servicios', servicios)

routes.use('/tiendas', tiendas)

routes.use('/admin', admin)

module.exports = routes

// // Manage web scrapers
// app.get('/scrapers', function (req, res) {
//     res.render('scrapers')
// })