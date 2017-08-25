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
// mongoose.connect('mongodb://localhost/projectpets')
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.get('/', function (req, res) {
    res.render('home')
})

// savecollection.save('medsnoi.json')

// let date = new Date()
// console.log('Process started at: ' + date.getSeconds())
// meddaymascotas.scrapper();
// noi.scraper()

app.listen(3000, function () {
    console.log('App listening on port 3000')
})