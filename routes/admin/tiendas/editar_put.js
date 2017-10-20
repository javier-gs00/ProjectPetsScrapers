const Stores = require('../../../utils/dbmodels/store.js')
const validation = require('../../../utils/validation/validation.js')

// UPDATE the store values to the DB
module.exports = function (req, res) {

    let errors = []
    
    let errObj = {
        brandnameLength: '',
        locationnameLength: '',
        websiteURL: '',
        addressstreetLength: '',
        addresscommuneLength: '',
        addressregionLength: '',
        phone1Num: '',
        phone1Length: '',
        phone2Num: '',
        phone2Length: '',
        email: ''
    }

    let brand_name = req.body.brand_name,
        location_name = req.body.location_name,
        website = req.body.website,
        address_street = req.body.address_street,
        address_commune = req.body.address_commune,
        address_region = req.body.address_region,
        phone1 = req.body.phone1,
        phone2 = req.body.phone2,
        email = req.body.email,
        food_shop = req.body.food_shop,
        med_shop = req.body.med_shop,
        shipping = req.body.shipping,
        clinic = req.body.clinic

    errObj.brandnameLength = validation.check.length(brand_name, 1, 100, 'Debe ingresar el nombre de la empresa')
    errObj.locationnameLength = validation.check.length(location_name, 1, 100, 'Debe ingresar el nombre del local')
    errObj.websiteURL = validation.check.url(website, 'El sitio debe estar en el formato http://www.sitio.x')
    errObj.addressstreetLength = validation.check.length(address_street, 1, 100, 'La dirección debe incluir el nombre de la calle y el número')
    errObj.addresscommuneLength = validation.check.length(address_commune, 1, 100, 'La comuna debe contener sólo caracteres y tener un largo mayor a dos caracteres')
    errObj.addressregionLength = validation.check.length(address_region, 1, 100, 'La región debe contener sólo caracteres y tener un largo mayor a dos caracteres')
    errObj.phone1Length = validation.check.length(phone1, 9, 9, 'El número de telefono principal debe contener al menos nueve números')
    errObj.phone1Num = validation.check.numeric(phone1, 'El número de telefono principal debe contener sólo números')
    if (phone2) {
        errObj.phone2Length = validation.check.length(phone2, 9, 9, 'El número de telefono secundario debe contener al menos nueve números')
        errObj.phone2Num = validation.check.numeric(phone2, 'El número de telefono secundario debe contener sólo números')
    }

    // POPULATE ERRORS COLLECTION IN ORDER
    for (let i in errObj) {
        if (errObj.hasOwnProperty(i)) {
            if (errObj[i] !== ''){
                errors.push({ msg: errObj[i]})
            }
        }
    }

    if (errors.length > 0) {
        return res.render('tiendas_editar', {
            id: req.params.id,
            store: req.body,
            errors: errors
        })
    } else {
        Stores.findByIdAndUpdate(req.params.id, req.body, function (err, store) {
            console.log('DB UPDATE Store -- location_name: ' + req.body.location_name + ' -- id: ' + req.params.id)
            res.redirect('/admin/tiendas')
        })
    }
}