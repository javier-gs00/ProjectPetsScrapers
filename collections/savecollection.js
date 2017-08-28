// Module for saving JSON files obtained by the scraper into the database
// For now is set to save into the Meds collection by default. Future update is to be able to choose to which the documents will be saved
const mongoose = require('mongoose')
const fs = require('fs')

let counter = 0

exports.save = function (filename) {
    let location = '/scrapersJSON/' + filename

    // Define medicine Mongoose Schema
    let medSchema = mongoose.Schema({
        name: String,
        price: String,
        href: String,
        category: String,
        brand: String,
        image_href: String,
        store: String,
    })

    // Create a Mongoose model from the Schema (name between single quotes is the name of the collection in mongodb)
    let MedicineModel = mongoose.model('Med', medSchema)

    // Read JSON file
    let medObj = JSON.parse(fs.readFileSync(__dirname + location, 'utf8'))

    medObj.forEach(function(element) {
        let medDocument = new MedicineModel({
            name: element.name,
            price: element.price,
            href: element.link,
            category: element.category,
            brand: element.brand,
            image_href: element.image,
            store: element.store
        })

        medDocument.save(function (err, medDocument) {
            if (err) return console.error(err)
        })
        
        counter += 1
    }, this);

    console.log('saved ' + counter + ' documents in the meds collection')
}