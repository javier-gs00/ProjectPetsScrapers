const StoreModel = require('../../../dbmodels/store.js').StoreModel
// const { check, validationResult } = require('express-validator/check')

module.exports = function (req, res) {                                
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        // console.log(errors.array())
        return res.render('tiendas_nueva', {
            errors: errors.mapped()
        })
    }

    console.log('check')

    let newStore = new StoreModel ({
        brand_name: req.body.brand_name,
        location_name: req.body.location_name,
        website: req.body.website,
        address_street: req.body.address_street,
        address_commune: req.body.address_commune,
        address_region: req.body.address_region,
        phone1: req.body.phone1,
        phone2: req.body.phone2,
        email: req.body.email,
        food_shop: req.body.food_shop,
        med_shop: req.body.med_shop,
        shipping: req.body.shipping,
        clinic: req.body.clinic
    })

    newStore.save(function (err, newStore) {
        if (err) {
            console.log(err)
        } else {
            // let newStore = Stores.findOne({name: req.body.store_name}) 
            console.log('DB INSERT Store -- location_name: ' + newStore.location_name + ' -- id: ' + newStore._id)
            res.redirect('/admin/tiendas')
        }
    })
}