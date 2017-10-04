const StoreModel = require('../../utils/dbmodels/store.js').StoreModel

module.exports = function (req, res) {
       
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
        StoreModel.
            find({ 
                address_commune:  new RegExp(req.query.comuna, 'i'), 
                address_region: new RegExp(req.query.region, 'i')
            }, function (err, stores) {
                if (err) handleError(err)

                let isEmpty = (stores[0])? false : true
                res.render('tiendas', { 
                    store: stores, 
                    empty: isEmpty 
                })
            })
    } else {
    // No filters used
        StoreModel.find().exec(function (err, stores) {
            res.render('tiendas', {
                store: stores
            })
        })
    }
}