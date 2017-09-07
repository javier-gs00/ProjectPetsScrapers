const StoreModel = require('../../../dbmodels/store.js').StoreModel

// UPDATE the store values to the DB
module.exports = function (req, res) {
        StoreModel.findByIdAndUpdate(req.params.id, req.body, function (err, store) {
        console.log('DB UPDATE Store -- location_name: ' + req.body.location_name + ' -- id: ' + req.params.id)
        res.redirect('/admin/tiendas')
    })
}