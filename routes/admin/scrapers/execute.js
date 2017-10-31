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

    // Measure time in milliseconds from two points in the code
    function time (t0) {
        if (!t0) return process.hrtime()

        const t1 = process.hrtime(t0)

        return Math.round((t1[0]*1000 + (t1[1]/1000000)))
    }

    let deleteMeds = req.body.deleteMeds
    let executeMeds = req.body.executeMeds

    switch (deleteMeds) {
        case "daymascotas":      
            medicine.deleteMany('store', 'Day Mascotas', function (err, DeleteWriteOpResultObject) {
                renderMeds(err, 'delete', DeleteWriteOpResultObject.deletedCount)
            })
            break;
        case "noi":
            medicine.deleteMany('store', 'Noi', function (err, DeleteWriteOpResultObject) {
                renderMeds(err, 'delete', DeleteWriteOpResultObject.deletedCount)
            })
            break;
    }

    switch (req.body.executeMeds) {
        case 'daymascotas':
            let t0 = time()
            // const t0 = process.hrtime()
            daymascotas.scrappercb(function (err, data) {
                let t1 = time(t0)
                console.log('Day Mascotas scraper took: ' + t1 + ' miliseconds.')
                // const t1 = process.hrtime(t0)
                // console.log('Day Mascotas scraper took: ' + (t1[0]*1000 + (t1[1]/1000000)) + ' miliseconds.')
                const t2 = process.hrtime()
                saveObjectToDB(data, 'Medicine', 'Brand', 'Day Mascotas', function (err, counter) {
                    const t3 = process.hrtime(t2)
                    console.log('Saving Day Mascotas data to the DB took: ' + (t3[0]*1000 + (t3[1]/1000000)) + ' miliseconds.')
                    renderMeds(err, 'execute', counter)
                })
            })
            break;
        case 'noi':
            let start = time()
            noi.scrapercb(function (err, data) {
                let duration = time(start)
                console.log('Day Mascotas scraper took: ' + duration + ' miliseconds.')
                let startdb = time()
                saveObjectToDB(data, 'Medicine', 'Brand', 'Noi', function (err, counter) {
                    let durationdb = time(startdb)
                    console.log('Saving Day Mascotas data to the db took: ' + durationdb + ' miliseconds.')
                    renderMeds(err, 'execute', counter)
                })
            })
            break;
    }

    if (req.body.execute === 'toJson') {
        medicine.dbToJson(res.locals.dirname, 'scraped_meds.json', function (err) {
            res.render('scrapers', {
                dbToJson: true
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