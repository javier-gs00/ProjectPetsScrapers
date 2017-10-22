const search = require('express').Router()
const Meds = require('../../utils/dbmodels/medicine.js')
const check = require('../../utils/validation/validation.js').check

// (READ) Search form route and return data
search.get('/', function (req, res) {
    console.log(req.query.query)
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

    function checkResults (results) {
        let errors = []
        
        if (results.length === 0) { 
            errors = [{ msg : 'No se encontraron resultados' }] 
        } else {
            results: true
            errors = false
        }

        res.render('home', {
            results: results,
            errors: errors,
            query: query,
            med: results
        })
    }

    // Used to check if the req.query object already exists
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
        checkQuery(query, function () {
            Meds.find(query, function (err, meds) {
                if (req.query.name == '' && req.query.store == '' && req.query.price == '') return checkResults(meds)

                Meds.sort(query, 'name', -1, function (err, meds) {
                    checkResults(meds)
                })
            })
        })
    } else {
    // No filters used
        checkQuery(query, function () {
            Meds.find(query, function (err, meds) {            
                checkResults(meds)
            })
        })
    }
})

module.exports = search