const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const fs = require('fs')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Users = require('./utils/dbmodels/user.js')
const routes = require('./routes')

// Authentication Packages
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const app = express()
require('dotenv').config()

// MongoDB Connection
mongoose.connect(process.env.DB_HOST)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

// MongoDB Store initialization for sessions
const store = new MongoDBStore ({
        uri: process.env.DB_HOST,
        collection: 'Sessions'
    }
)

// Catch Errors
store.on('error', function (error) {
    assert.ifError(error)
    assert.ok(false)
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride(function (req, res) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method
    delete req.body._method
    return method
}))

app.use(session({
    secret: 'secret',
    store: store,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(function (req, res, next) {
    // For every response to the user pass along the isAuthenticated property
    // This will be passed through every view automatically (no need to pass it through the routes)
    res.locals.isAuthenticated = req.isAuthenticated()
    next()
})

app.use(function (req, res, next) {
    // pass __dirname for saving and loading files when using the web scrapers
    let dirname = __dirname
    res.locals.dirname = dirname
    next()
})

app.use('/', routes)

passport.use(new LocalStrategy({
    // Replaces username with the name of the properties in the POST body that are sent to the server 
        usernameField: 'email'
    },
    function (username, password, done) {
        Users.findByEmail(username, function (err, user) {
            if (err) { return done(err) }
            
            if (!user) {
                console.log('user not found')
                return done(null, false, { message: 'Nombre de usuario incorrecto' })
            } else {
                bcrypt.compare(password, user.password, function (err, res) {
                    if (res === true) {
                        return done(null, user)
                    } else {
                        console.log('login attempt failed for user: ' + user.username)
                        return done(null, false, { message: 'Contraseña incorrecta' })
                    }
                })
            }
        })
    }
))

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error ('Not Found')
    err.status = 404
    next(err)
})

app.listen(process.env.PORT, function () {
    console.log('App listening on port 3000')
})