const StoreModel = require('../../../utils/dbmodels/store.js').StoreModel

// EDIT a store values on the website
module.exports = function (req, res) {
        StoreModel.findById(req.params.id).exec(function (err, store) {
        res.render('tiendas_editar', {store: store})
    })
}