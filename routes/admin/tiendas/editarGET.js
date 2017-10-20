const Stores = require('../../../utils/dbmodels/store.js')

// EDIT a store values on the website
module.exports = function (req, res) {
    Stores.findById(req.params.id, function (err, store) {
        res.render('tiendas_editar', {
            store: store
        })
    })
}