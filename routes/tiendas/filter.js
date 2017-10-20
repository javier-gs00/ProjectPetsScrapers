const Stores = require('../../utils/dbmodels/store.js')

module.exports = function (req, res) {
    let commune = req.query.comuna
    let region = req.query.region
       
    function isEmpty(obj) {
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false
            }
        }
        return true
    }

    // Filter used
    if (isEmpty(req.query) === false) {
        Stores.find(commune, region, function(err, stores) {
            let isEmpty = (stores[0])? false : true

            res.render('tiendas', {
                store: stores,
                empty: isEmpty
            })
        })
    } else {
    // No filters used
        Stores.findAll(function (err, stores) {
            res.render('tiendas', {
                store: stores
            })
        })
    }
}