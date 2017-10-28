const { save, saveObjectToDB } = require('../../../utils/webscrapers/scrapers/scrapers_utils.js')
const fs = require('fs')
const medicine = require('../../../utils/dbmodels/medicine.js')

// -------------- IMPORT SCRAPERS --------------
const noi = require('../../../utils/webscrapers/scrapers/noi.js')
const daymascotas = require('../../../utils/webscrapers/scrapers/daymascotas.js')

module.exports = function (req, res) {
    // function scraperExec (callback) {
    //     let noiScraper = noi.scraper()

    //     noiScraper.then(function (data) {
    //         saveObjectToDB(data, function (err, counter) {
    //             callback(err, counter)
    //         })
    //     })

    //     noiScraper.catch(function (err) {
    //         console.error(err)
    //         res.render('scrapers', {
    //             success: false
    //         })
    //     })


    // }

    // medicine.deleteMany('store', 'Noi', function (err, DeleteWriteOpResultObject) {
    //     console.log('Deleted document(s): ' + DeleteWriteOpResultObject.deletedCount)
    // })

    // res.render('scrapers', {
    //     success: true
    // })

    console.log(req.body)
    if (req.body.deleteMeds === 'noi') {
        let counter = 0

        medicine.deleteMany('store', 'Noi', function (err, DeleteWriteOpResultObject) {
            console.log('Deleted document(s): ' + DeleteWriteOpResultObject.deletedCount)
            counter = DeleteWriteOpResultObject.deletedCount

            if (err) {
                console.error(err)
            } else {
                res.render('scrapers', {
                    delete: true,
                    counter: counter
                })
            }
        })
    }
    if (req.body.executeMeds === 'noi') {
        noi.scrapercb(function (err, data) {
            saveObjectToDB(data, 'Medicine', 'Brand', 'Noi', function (err, counter) {
                if (err) {
                    console.error(err)
                    res.render('scrapers', {
                        success: false
                    })
                } else {
                    console.log(counter + ' documents saved to the Meds collection')
                    res.render('scrapers', {
                        success: true,
                        counter: counter
                    })
                }
            })
        })
    }
    // scraperExec(function (err, counter) {
    //     console.log('counter is ' + counter)
    //     res.render('scrapers', {
    //         success: true
    //     })
    // })


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