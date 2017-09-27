const StoreModel = require('../../../utils/dbmodels/store.js').StoreModel

// DELETE a store from the DB
module.exports = function (req, res) {
    let storeName 

    StoreModel.findById(req.params.id, function (err, doc) {
        storeName = (doc.name) ? doc.location_name : 'NA'
    })

    StoreModel.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log('DB DELETE Store -- name: ' + storeName + ' -- id: ' + req.params.id)
            res.redirect('/admin/tiendas')
        }
    })
}