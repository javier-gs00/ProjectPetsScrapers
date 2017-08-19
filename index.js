// const meddaymascotas = require('./scrapers/meddaymascotas.js');
const noi = require('./scrapers/noi.js')
const fs = require('fs')
const mongoose = require('mongoose')
const savecollection = require('./savecollection.js')

mongoose.connect('mongodb://localhost/projectpets')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

savecollection.save('medsnoi.json')

// let date = new Date()
// console.log('Process started at: ' + date.getSeconds())
// meddaymascotas.scrapper();
// noi.scraper()

console.log('end of process')