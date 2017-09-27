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

module.exports.MedModel = MedModel

