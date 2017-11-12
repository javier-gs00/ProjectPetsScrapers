const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.ObjectId

let searchStats = new Schema({
    query: String,
    qty: Number
})

function find (query) {
    searchStats.find({ query: query }, function (err, result) {
        
    })
}

function save (query) {

}