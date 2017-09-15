const StoreModel = require('../../../dbmodels/store.js').StoreModel
const { check, validationResult } = require('express-validator/check')

// EDIT a store values on the website
module.exports = function (req, res) {
        StoreModel.findById(req.params.id).exec(function (err, store) {
        res.render('tiendas_editar', {store: store})
    })
}