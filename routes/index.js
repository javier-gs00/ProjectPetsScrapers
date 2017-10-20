const routes = require('express').Router()
const passport = require('passport')
const search = require('./search')
const alimentos = require('./alimentos')
const medicamentos = require('./medicamentos')
const servicios = require('./servicios')
const tiendas = require('./tiendas')
const admin = require('./admin')
const users = require('./usuarios')
const Users = require('../utils/dbmodels/user.js')

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

routes.use('/admin', authenticationMiddleware(), admin)

routes.use('/usuarios', users)

routes.use('/logout', function (req, res) {
    // Clear login session and remove req.user
    req.logOut()
    // Clears session store
    req.session.destroy()
    res.redirect('/')
})

// Passport Middleware for routes
passport.serializeUser(function (user, done) {
    done(null, user._id)
})

passport.deserializeUser(function (id, done) {
    Users.findById(id, function (err, user) {
        done(err, user)
    })
})

function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}` + ' - username: ' + req.user.username);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/usuarios/login')
	}
}

module.exports = routes