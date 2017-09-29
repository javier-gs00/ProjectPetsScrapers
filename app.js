const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const fs = require('fs')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const passport = require('passport')
const routes = require('./routes')

const app = express()

mongoose.connect('mongodb://localhost/projectpets')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

const store = new MongoDBStore (
    {
        uri: 'mongodb://localhost/projectpets',
        collection: 'Sessions'
    }
)

// Catch Errors
store.on('error', function (error) {
    assert.ifError(error)
    assert.ok(false)
})

app.use(bodyParser.urlencoded({extended: true}))
// app.use(methodOverride('_method'))
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

app.use('/', routes)

app.listen(3000, function () {
    console.log('App listening on port 3000')
})