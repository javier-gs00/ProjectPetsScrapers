const mongoose = require('mongoose')
const fs = require('fs')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let MedSchema = new Schema({
    name: String,
    price: String,
    href: String,
    image_href: String,
    store: String,
})

const MedModel = mongoose.model('meds', MedSchema)

function Medicine (name, price, link, category, brand, image, store) {
    this.name = name;
    this.price = price;
    this.link = link;
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

// Sort results by category and order, wich is given in the 'sort' parameter
// 'sort' is composed of a category and a + or - for order. e.g: 'name' or '-name'
function sort (query, sort, callback) {
    MedModel.find({ name: new RegExp(query, 'i') }).sort(sort).exec(
        callback
    )
}

// Delete documents from the database
function deleteMany (category, criteria, callback) {
    if (category === 'name') {
        MedModel.deleteMany({ name: criteria}, function (err, DeleteWriteOpResultObject) {
            callback(err, DeleteWriteOpResultObject)
        })
    } else if (category === 'store') {
        MedModel.deleteMany({ store: criteria}, function (err, DeleteWriteOpResultObject) {
            callback(err, DeleteWriteOpResultObject)
        })
    } else {
        console.log('Delete Err')
    }
}

// Export all scraped med data from the DB to a JSON file
function dbToJson (path, filename, callback) {
    findAll(function (err, results) {
        let resJson = JSON.stringify(results, null, 2)

        let location = path + '/utils/webscrapers/scrapers/scrapers_json_files/' + filename

        fs.writeFile(location, resJson, function (err) {
            console.log('JSON created')
            callback(err)
        })
    })
}

module.exports = {
    MedModel,
    Medicine,
    find,
    findAll,
    sort,
    deleteMany,
    dbToJson
}