const mongoose = require('mongoose')
const fs = require('fs')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let ProductSchema = new Schema({
    name: String,
    price: Number,
    href: String,
    image_href: String,
    category: String,
    store: String,
    date: { type: Date, default: Date.now},
    animal: String
})

const ProductModel = mongoose.model('products', ProductSchema)

// Find products by name
function find (query, cb) {
    ProductModel.find({ name: new RegExp(query, 'i')}, function (err, products) {
        cb(err, products)
    })
}

// Sort results by category and order, wich is given in the 'sort' parameter
// 'sort' is composed of a category and a + or - for order. e.g: 'name' or '-name'
function sort (query, sort, callback) {
    ProductModel.find({ name: new RegExp(query, 'i') }).sort(sort).exec(
        callback
    )
}

module.exports = {
    find,
    sort
}