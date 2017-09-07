const tiendas = require('express').Router()
const single = require('./single')
const StoreModel = require('../../dbmodels/store.js').StoreModel

// READ and show all stores data
tiendas.get('/', function (req, res) {
    StoreModel.find().exec(function (err, stores) {
        res.render('tiendas', {
            store: stores
        })
    })
})

tiendas.get('/:name', single)

module.exports = tiendas