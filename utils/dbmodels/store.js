const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let StoreSchema = mongoose.Schema({
    brand_name: String,
    location_name: String,
    website: String,
    address_street: String,
    address_commune: String,
    address_region: String,
    phone1: Number,
    phone2: Number,
    email: String,
    food_shop: String,
    med_shop: String,
    shipping: String,
    clinic: String
})

StoreModel = mongoose.model('stores', StoreSchema)

module.exports.StoreModel = StoreModel