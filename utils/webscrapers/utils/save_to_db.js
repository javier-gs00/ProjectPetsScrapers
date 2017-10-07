// Module for saving JSON files obtained by the scraper into the database
// For now is set to save into the Meds collection by default. Future update is to be able to choose to which the documents will be saved
const mongoose = require('mongoose')
const fs = require('fs')
const MedModel = require('../../dbmodels/medicine.js').MedModel

exports.save = function (medList, callback) {
    let counter = 0
    // let location = path + '/utils/webscrapers/scrapers/scrapers_json_files/' + filename

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

    // // Create a Mongoose model from the Schema (name between single quotes is the name of the collection in mongodb)
    // let MedicineModel = mongoose.model('Med', medSchema)

    // Read JSON file
    // let medObj = JSON.parse(fs.readFileSync(location, 'utf8'))
    
    medList.forEach(function(element) {
        let medDocument = new MedModel({
            name: element.name,
            price: element.price,
            href: element.link,
            category: element.category,
            brand: element.brand,
            image_href: element.image,
            store: element.store
        })

        medDocument.save(function (err, medDocument) {
            if (err) return callback(err)
        })
        
        counter += 1
    });

    callback(null, counter)
}