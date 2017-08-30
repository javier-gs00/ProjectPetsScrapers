// import modules
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const fs = require('fs')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
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
    brand_name: String,
    location_name: String,
    website: String,
    address_street: String,
    address_commune: String,
    address_region: String,
    phone1: Number,
    phone2: Number,
    email: String,
    food_shop: String,
    med_shop: String,
    shipping: String,
    clinic: String
})

medSchema.statics.findByName = function (name, callback) {
    return this.find({name: new RegExp(name, 'i')}, callback)
}

let Meds = mongoose.model('meds', medSchema)
let Stores = mongoose.model('stores', storeSchema)

app.use(bodyParser.urlencoded({extended: true}))
app.use(methodOverride('_method'))
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
        res.render('tiendas', {
            store: tiendas
        })
    })
})

// READ and show a particular store data
app.get('/tiendas/:name', function (req, res) {
    res.render('tiendas')
})

// READ and show all stores data for managing porpuses
app.get('/gestiontiendas', function (req, res) {
    Stores.find().exec(function (err, tiendas) {
        res.render('tiendas_gestion', {
            store: tiendas
        })
    })
})

// Form for adding a new store
app.get('/gestiontiendas/nuevatienda', function (req, res) {
    res.render('tiendas_nueva')
})

// CREATE a new store 
app.post('/agregartienda', function (req, res) {
    let newStore = new Stores ({
        brand_name: req.body.brand_name,
        location_name: req.body.location_name,
        website: req.body.website,
        address_street: req.body.address_street,
        address_commune: req.body.address_commune,
        address_region: req.body.address_region,
        phone1: req.body.phone1,
        phone2: req.body.phone2,
        email: req.body.email,
        food_shop: req.body.food_shop,
        med_shop: req.body.med_shop,
        shipping: req.body.shipping,
        clinic: req.body.clinic
    })

    newStore.save(function (err, newStore) {
        if (err) {
            console.log(err)
        } else {
            // let newStore = Stores.findOne({name: req.body.store_name}) 
            console.log('DB INSERT Store -- location_name: ' + newStore.location_name + ' -- id: ' + newStore._id)
            res.redirect('/gestiontiendas')
        }
    })
})

// EDIT a store values on the website
app.get('/gestiontiendas/edit/:id', function (req, res) {
    Stores.findById(req.params.id).exec(function (err, store) {
        res.render('tiendas_editar', {store: store})
    })
})

// UPDATE the store values to the DB
app.put('/editartienda/:id', function (req, res) {
    Stores.findByIdAndUpdate(req.params.id, req.body, function (err, store) {
        console.log('DB UPDATE Store -- location_name: ' + req.body.location_name + ' -- id: ' + req.params.id)
        res.redirect('/gestiontiendas')
    })
})

// DELETE a store from the DB
app.delete('/eliminartienda/:id', function (req, res) {
    let storeName 
    Stores.findById(req.params.id, function (err, doc) {
        storeName = (doc.name) ? doc.location_name : 'NA'
    })
    Stores.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('DB DELETE Store -- name: ' + storeName + ' -- id: ' + req.params.id)
            res.redirect('/gestiontiendas')
        }
    })
})

// Manage web scrapers
app.get('/scrapers', function (req, res) {
    res.render('scrapers')
})

// savecollection.save('medsnoi.json')

// let date = new Date()
// console.log('Process started at: ' + date.getSeconds())
// meddaymascotas.scrapper();
// noi.scraper()

app.listen(3000, function () {
    console.log('App listening on port 3000')
})