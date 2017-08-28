// const meddaymascotas = require('./scrapers/meddaymascotas.js');
// const noi = require('./scrapers/noi.js')
const express = require('express')
const bodyParser = require('body-parser')
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

app.get('/tiendas', function (req, res) {
    Stores.find().exec(function (err, tiendas) {
        console.log(tiendas)
        res.render('tiendas', {
            store: tiendas
        })
    })
})

app.get('/tiendas/:name', function (req, res) {
    res.render('tiendas')
})

app.get('/gestiontiendas', function (req, res) {
    res.render('gestiontiendas')
})

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