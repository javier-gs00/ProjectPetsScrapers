const search = require('express').Router()
const Meds = require('../../utils/dbmodels/medicine.js')
const check = require('../../utils/validation/validation.js').check

// (READ) Search form route and return data
search.get('/', function (req, res) {
    let query = req.query.query
 
    function checkQuery (query, callback) {
        let errors = []

        if (query === ' ' || query === '') {
            let msg = 'Favor verificar los parametros de busqueda'
            errors.push({ msg: msg })

            return res.render('home', {
                errors: errors
            })
        } else if (query.length === 1) {
            let msg = 'No se encontraron resultados para la busqueda'
            errors.push({ msg: msg })

            return res.render('home', {
                errors: errors
            })
        } else {
            callback(null, query)
        }
    }

    checkQuery(query, function () {
        Meds.find(query, function (err, meds) {
            let errors = []

            if (meds.length === 0) { 
                errors = [{ msg : 'No se encontraron resultados' }] 
            } else {
                errors = false
            }

            res.render('home', {
                errors: errors,
                med: meds
            })
        })
    })
})

module.exports = search