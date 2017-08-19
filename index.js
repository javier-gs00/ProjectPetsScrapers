// const meddaymascotas = require('./scrapers/meddaymascotas.js');
const noi = require('./scrapers/noi.js')
const fs = require('fs')
// const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/projectpets')
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))

// // Define medicine Mongoose Schema
// let medSchema = mongoose.Schema({
//     name: String,
//     price: String,
//     href: String,
//     category: String,
//     brand: String,
//     image_href: String,
//     store: String,
// })

// // Compile medicine Schema into a Model (name between single quotes is the name of the collection in mongodb)
// let MedicineModel = mongoose.model('Med', medSchema)

// // Read JSON file
// let medObj = JSON.parse(fs.readFileSync(__dirname + '/scrapersJSON/medsnoi.json', 'utf8'))

// medObj.forEach(function(element) {
//     let medDocument = new MedicineModel({
//         name: element.name,
//         price: element.price,
//         href: element.link,
//         category: element.category,
//         brand: element.brand,
//         image_href: element.image,
//         store: element.store
//     })

//     medDocument.save(function (err, medDocument) {
//         if (err) return console.error(err)
//     })
    
// }, this);

// let date = new Date()
// console.log('Process started at: ' + date.getSeconds())
// meddaymascotas.scrapper();
noi.scraper()

console.log('end of process')





