const routes = require('express').Router()
const search = require('./search')
const alimentos = require('./alimentos')
const medicamentos = require('./medicamentos')
const servicios = require('./servicios')
const tiendas = require('./tiendas')
const admin = require('./admin')
const users = require('./usuarios')

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

routes.use('/usuarios', users)

module.exports = routes

// // Manage web scrapers
// app.get('/scrapers', function (req, res) {
//     res.render('scrapers')
// })