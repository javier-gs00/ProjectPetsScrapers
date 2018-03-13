const search = require('express').Router()
const Products = require('../../utils/dbmodels/products')
const check = require('../../utils/validation/validation.js').check

// (READ) Search form route and return data
search.get('/', function (req, res) {
    console.log(req.query.query)
    let query = req.query.query
    let nameFilter = req.query.name
    let storeFilter = req.query.store
    let priceFilter = req.query.price
 
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
        let success = undefined
        
        if (results.length === 0) { 
            errors = [{ msg : 'No se encontraron resultados' }]
            success = false
        } else {
            success = true
            errors = false
        }

        modifyRes(results, false)
        .then(function (medResults) {
            res.render('home', {
                success: success,
                errors: errors,
                query: query,
                med: medResults
            })
        })
        .catch(function (err) {
            console.log(err)
            res.render('home', {
                success: success,
                errors: errors,
                query: query,
                med: jsonRes
            })
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

    function modifyRes(results, json) {
        return new Promise (function (resolve, reject) {
            let modResults = []
            console.log('------------- RESULTS -------------')
            console.log(results)
            results.forEach(function(result) {
                // transform the price into a string and add a $ and a .
                let price = result.price.toString()
                if (price.length > 4) {
                    price = "$" + price.slice(0, 2) + "." + price.slice(-3)
                } else {
                    price = "$" + price.slice(0, 1) + "." + price.slice(-3)
                }

                // transform the rest of the parameters to a string for json
                let name = result.name.toString()
                let store = result.store.toString()
    
                modResults.push({
                    "name": name,
                    "price": price,
                    "store": store
                })
            })
            if (json == true) {
                let jsonRes = JSON.stringify(modResults)
                resolve(jsonRes)
            } else {
                resolve(modResults)
            } 
        })
    }

    if (query != '' && nameFilter == undefined && storeFilter == undefined && priceFilter == undefined) {
    // No filters used. First query doesnt have any filters
        checkQuery(query, function () {
            Products.find(query, function (err, meds) {            
                checkResults(meds)
            })
        })
    } else if (query != '' || nameFilter != undefined || storeFilter != undefined || priceFilter != undefined) {
    // Filter used. A query with at least one filter different than undefined means that a filter was applied
        checkQuery(query, function () {
            let filter = ''

            if ( nameFilter != '') {
                filter = nameFilter
            } else if ( storeFilter != '') {
                filter = storeFilter
            } else if ( priceFilter != '') {
                filter = priceFilter
            }

            // Sorting used
            Products.sort(query, filter, function (err, meds) {
                checkResults(meds)
            })

            // No sorting used
            // if (filter == '') {
            //     Meds.find(query, function (err, meds) {
            //         checkResults(meds)
            //     })
            // } else {
            //     // Sorting used
            //     Meds.sort(query, filter, function (err, meds) {
            //         checkResults(meds)
            //     })
            // }
        })
    }
})

module.exports = search