const search = require('express').Router()
const Meds = require('../../utils/dbmodels/medicine.js')
const check = require('../../utils/validation/validation.js').check

// (READ) Search form route and return data
search.get('/', function (req, res) {
    console.log(req.query.query)
    let query = req.query.query
    let nameFilter = req.query.name
    let storeFilter = req.query.store
    let priceFilter = req.query.price

    console.log(nameFilter == undefined)
 
    // Check contents of query before sending it to the database
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
        } else if (query === null) {
            return res.redirect('/')
        } else {
            callback(null, query)
        }
    }

    // Check if results exists then renders the view
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
            med: results,
            messsage: 'hello world'
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


    if (query != '' && nameFilter == undefined && storeFilter == undefined && priceFilter == undefined) {
    // No filters used
        checkQuery(query, function () {
            Meds.find(query, function (err, meds) {
                console.log('no sorting')            
                checkResults(meds)
            })
        })
    } else if (query != '' || nameFilter != undefined || storeFilter != undefined || priceFilter != undefined) {
    // Filter used
        checkQuery(query, function () {
            let filter = ''

            if ( nameFilter != '') {
                filter = nameFilter
            } else if ( storeFilter != '') {
                filter = storeFilter
            } else if ( priceFilter != '') {
                filter = priceFilter
            }

            if (filter == '') {
                Meds.find(query, function (err, meds) {
                    console.log('no filter')
                    checkResults(meds)
                })
            } else {
                Meds.sort(query, filter, function (err, meds) {
                    console.log('filter used')
                    checkResults(meds)
                })
            }
        })
    }
})

module.exports = search