const routes = require('express').Router()
const passport = require('passport')
const search = require('./search')
const alimentos = require('./alimentos')
const medicamentos = require('./medicamentos')
const servicios = require('./servicios')
const tiendas = require('./tiendas')
const admin = require('./admin')
const users = require('./usuarios')
const UserModel = require('../utils/dbmodels/user.js').UserModel

// Landing page
routes.get('/', function (req, res) {
    console.log(req.user)
    console.log(req.isAuthenticated())
    res.render('home')
})

routes.use('/search', search)

routes.use('/alimentos', alimentos)

routes.use('/medicamentos', medicamentos)

routes.use('/servicios', servicios)

routes.use('/tiendas', tiendas)

routes.use('/admin', admin)

routes.use('/usuarios', users)

passport.serializeUser(function (user, done) {
    done(null, user._id)
})

passport.deserializeUser(function (id, done) {
    UserModel.findById(id, function (err, user) {
        done(err, user)
    })
})

module.exports = routes

// // Manage web scrapers
// app.get('/scrapers', function (req, res) {
//     res.render('scrapers')
// })