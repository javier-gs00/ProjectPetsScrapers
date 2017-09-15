const StoreModel = require('../../../dbmodels/store.js').StoreModel
const { check, validationResult } = require('express-validator/check')

// UPDATE the store values to the DB
module.exports = function (req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.render('tiendas_editar', {
            id: req.params.id,
            store: req.body,
            errors: errors.mapped()
        })
    }

    StoreModel.findByIdAndUpdate(req.params.id, req.body, function (err, store) {
        console.log('DB UPDATE Store -- location_name: ' + req.body.location_name + ' -- id: ' + req.params.id)
        res.redirect('/admin/tiendas')
    })
}