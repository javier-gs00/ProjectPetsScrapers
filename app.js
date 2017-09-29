const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const fs = require('fs')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const session = require('express-session')
const routes = require('./routes')
// import web scrapers
// const meddaymascotas = require('./scrapers/meddaymascotas.js');
// const noi = require('./scrapers/noi.js')
// const savecollection = require('./collections/savecollection.js')

const app = express()
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
    resave: false,
    saveUninitialized: false
}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

mongoose.connect('mongodb://localhost/projectpets')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

app.use('/', routes)

app.listen(3000, function () {
    console.log('App listening on port 3000')
})