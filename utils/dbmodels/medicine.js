const mongoose = require('mongoose')
const fs = require('fs')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let MedSchema = new Schema({
    name: String,
    price: String,
    href: String,
    category: String,
    brand: String,
    image_href: String,
    store: String,
})

MedModel = mongoose.model('meds', MedSchema)

function Medicine (name, price, link, category, brand, image, store) {
    this.name = name;
    this.price = price;
    this.link = link;
    this.category = 'Medicine';
    this.brand = brand;
    this.image = image;
    this.store = store;
}

function find (query, cb) {
    MedModel.find({ name: new RegExp(query, 'i')}, function (err, meds) {
        cb(err, meds)
    })
}

function findAll (cb) {
    MedModel.find().exec(function (err, meds) {
        cb(err, meds)
    })
}

function sort (query, sort, callback) {
    MedModel.find({ name: new RegExp(query, 'i') }).sort(sort).exec(
        callback
    )
}

// Save scraped object to MongoDB
function saveObjectToDb (object, callback) {
    let counter = 0

    object.forEach(function(element) {
        let medDocument = new MedModel ({
            name: element.name,
            price: element.price,
            href: element.link,
            category: element.category,
            brand: element.brand,
            image_href: element.image,
            store: element.store
        })

        medDocument.save(function (err, medDocument) {
            if (err) console.error(err)
        })

        counter += 1  
    })

    callback(err, counter)
}

// Save scraped object to a JSON file
function saveObjectToJSON (object, store, path, callback) {
    let counter = 0
    let medList = []

    object.forEach(function (element) {
        let med = new Medicine (
            element.name,
            element.link,
            "Medicine",
            "Brand",
            element.image,
            store
        )

        counter += 1
        console.log(counter)
        medList.push(med)
    })

    fs.writeFile(path, JSON.stringify(medList, null, 2), function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log(store + ' medicine JSON file created')
        }
    })
}

module.exports = {
    Medicine,
    find,
    findAll,
    sort,
    saveObjectToDb,
    saveObjectToJSON
}
