// import modules
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const fs = require('fs')
const mongoose = require('mongoose')
// import web scrapers
// const meddaymascotas = require('./scrapers/meddaymascotas.js');
// const noi = require('./scrapers/noi.js')
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

let storeSchema = mongoose.Schema({
    name: String,
    website: String,
    address: Array,
    phone: Array,
    mail: String,
    food_shop: Boolean,
    med_shop: Boolean,
    shipping: Boolean,
    clinic: Boolean
})

medSchema.statics.findByName = function (name, callback) {
    return this.find({name: new RegExp(name, 'i')}, callback)
}

let Meds = mongoose.model('meds', medSchema)
let Stores = mongoose.model('stores', storeSchema)

app.use(bodyParser.urlencoded({extended: true}))
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// Main/Landing page
app.get('/', function (req, res) {
    res.render('home')
})

// (READ) Search form route and return data
app.get('/search', function (req, res) {
    Meds.findByName(req.query.query, function (err, meds) {
        res.render('home', {med: meds})
    })
})

// READ and show all food data
app.get('/alimentos', function (req, res) {
    res.render('alimentos')
})

// READ and show all medicine data
app.get('/medicamentos', function (req, res) {
    Meds.find().exec(function (err, medicamentos) {
        res.render('medicamentos', {
            product: medicamentos
        })
    })
})

// READ and show all services data
app.get('/servicios', function (req, res) {
    res.render('servicios')
})

// READ and show all stores data
app.get('/tiendas', function (req, res) {
    Stores.find().exec(function (err, tiendas) {
        console.log(tiendas)
        res.render('tiendas', {
            store: tiendas
        })
    })
})

// READ and show a particular store data
app.get('/tiendas/:name', function (req, res) {
    res.render('tiendas')
})

// Form for adding a new store
app.get('/gestiontiendas', function (req, res) {
    res.render('gestiontiendas')
})

// CREATE a new store 
app.post('/guardartienda', function (req, res) {
    let newStore = new Stores ({
        name: req.body.store_name,
        website: req.body.website,
        address: req.body.address,
        phone: req.body.phone,
        mail: req.body.email,
        food_shop: req.body.food_shop,
        med_shop: req.body.med_shop,
        shipping: req.body.shipping,
        clinic: req.body.clinic
    })

    newStore.save(function (err, newStore) {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/')
        }
    })
})

// savecollection.save('medsnoi.json')

// let date = new Date()
// console.log('Process started at: ' + date.getSeconds())
// meddaymascotas.scrapper();
// noi.scraper()

app.listen(3000, function () {
    console.log('App listening on port 3000')
})