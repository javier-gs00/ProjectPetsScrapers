// const meddaymascotas = require('./scrapers/meddaymascotas.js');
// const noi = require('./scrapers/noi.js')
const express = require('express')
const exphbs = require('express-handlebars')
const fs = require('fs')
const mongoose = require('mongoose')
// const savecollection = require('./collections/savecollection.js')

const app = express()
const router = express.Router()
const path = __dirname + '/'
mongoose.connect('mongodb://localhost/projectpets')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

let medSchema = mongoose.Schema({
    name: String,
    price: String,
    href: String,
    category: String,
    brand: String,
    image_href: String,
    store: String,
})

medSchema.statics.findByName = function (name, callback) {
    return this.find({name: new RegExp(name, 'i')}, callback)
}

let Meds = mongoose.model('meds', medSchema)

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', function (req, res) {
    res.render('home')
})

app.get('/search', function (req, res) {
    Meds.findByName(req.query.query, function (err, meds) {
        res.render('home', {med: meds})
    })
})

app.get('/alimentos', function (req, res) {
    res.render('alimentos')
})

app.get('/medicamentos', function (req, res) {
    Meds.find().exec(function (err, medicamentos) {
        res.render('medicamentos', {
            product: medicamentos
        })
    })
})

app.get('/servicios', function (req, res) {
    res.render('servicios')
})
// savecollection.save('medsnoi.json')

// let date = new Date()
// console.log('Process started at: ' + date.getSeconds())
// meddaymascotas.scrapper();
// noi.scraper()

app.listen(3000, function () {
    console.log('App listening on port 3000')
})