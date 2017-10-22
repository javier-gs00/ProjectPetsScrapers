const mongoose = require('mongoose')
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

function sort (query, category, order, callback) {
    let sortOrder = (order > 0)? category : '-' + category

    MedModel.find({ name: new RegExp(query, 'i') }).sort(sortOrder).exec(
        callback
    )
}

module.exports = {
    find,
    findAll,
    sort
}
