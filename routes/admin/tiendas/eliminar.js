const Stores = require('../../../utils/dbmodels/store.js')

// DELETE a store from the DB
module.exports = function (req, res) {
    Stores.findByIdAndRemove(req.params.id, function (err, storename) {
        console.log('DB DELETE Store -- name: ' + storename + ' -- id: ' + req.params.id)
        res.redirect('/admin/tiendas')
    })
}