const { save, saveObjectToDB } = require('../../../utils/webscrapers/scrapers/scrapers_utils.js')
const fs = require('fs')
const medicine = require('../../../utils/dbmodels/medicine.js')

// -------------- IMPORT SCRAPERS --------------
const noi = require('../../../utils/webscrapers/scrapers/noi.js')
const daymascotas = require('../../../utils/webscrapers/scrapers/daymascotas.js')

module.exports = function (req, res) {
    function renderMeds (err, type, counter) {
        if (err) {
            console.log(err)
            return res.render('scrapers', {
                error: true
            })
        } else if (type === 'execute') {
            console.log(counter + ' documents saved to the Meds collection')
            return res.render('scrapers', {
                executeMeds: true,
                counter: counter
            })
        } else if (type === 'delete') {
            console.log(counter + ' documents deleted from the Meds collection')
            return res.render('scrapers', {
                deleteMeds: true,
                counter: counter
            })
        } else {
            return res.redirect('/admin/scrapers')
        }
    }
    let deleteMeds = req.body.deleteMeds
    let executeMeds = req.body.executeMeds

    switch (deleteMeds) {
        case "daymascotas":      
            medicine.deleteMany('store', 'Day Mascotas', function (err, DeleteWriteOpResultObject) {
                renderMeds(err, 'delete', DeleteWriteOpResultObject.deletedCount)
            })
            // medicine.deleteMany('name', 'Bravecto 10 a 20kg', function (err, DeleteWriteOpResultObject) {
            //     renderMeds(err, 'delete', DeleteWriteOpResultObject.deletedCount)
            // })
            break;
        case "noi":
            medicine.deleteMany('store', 'Noi', function (err, DeleteWriteOpResultObject) {
                renderMeds(err, 'delete', DeleteWriteOpResultObject.deletedCount)
            })
            break;
    }

    switch (req.body.executeMeds) {
        case 'daymascotas':
            daymascotas.scrappercb(function (err, data) {
                saveObjectToDB(data, 'Medicine', 'Brand', 'Day Mascotas', function (err, counter) {
                    renderMeds(err, 'execute', counter)
                })
            })
            break;
        case 'noi':
            noi.scrapercb(function (err, data) {
                saveObjectToDB(data, 'Medicine', 'Brand', 'Noi', function (err, counter) {
                    renderMeds(err, 'execute', counter)
                })
            })
            break;
    }

    console.log(req.body.execute)
    if (req.body.execute === 'toJson') {
        // dbToJson('noi', res.locals.dirname, 'noi.json', function (err) {
        //     res.render('scrapers', {
        //         executeMeds: true
        //     })
        // })
        medicine.dbToJson('noi', res.locals.dirname, 'noi.json', function (err) {
            res.render('scrapers', {
                executeMeds: true
            })
        })
    }

    // function scraperExec (callback) {
    //     let noiScraper = noi.scraper()
    //     let daymascotasScraper = daymascotas.scrapper()
    //     let execCounter = 0

    //     noiScraper.then(function (medList) {
    //         save(medList, function (err, counter) {
    //             console.log('Noi scraper saved ' + counter + ' documents in the meds collection')
    //             execCounter += 1
    //         })
    //     })
    
    //     daymascotasScraper.then(function (medList) {
    //         save(medList, function (err, counter) {
    //             console.log('Day Mascotas scraper saved ' + counter + ' documents in the meds collection')
    //             execCounter += 1
    //             callback(null, execCounter)
    //         })
    //     })
    
    //     noiScraper.catch(function (err) {
    //         console.log('Noi ERR: ' + err)
    //         res.render('scrapers', {
    //             success: false
    //         })
    //     })
    
    //     daymascotasScraper.catch(function (err) {
    //         console.log('Day Mascotas ERR: ' + err)
    //         res.render('scrapers', {
    //             success: false
    //         })
    //     })
    // }

    // scraperExec(function (err, execCounter) {
    //     console.log('counter is ' + execCounter)
    //     if (execCounter === 2) {
    //         res.render('scrapers', {
    //             success: true
    //         })
    //     }
    // })
}