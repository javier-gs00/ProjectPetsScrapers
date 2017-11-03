const { saveObjectToDB, executeAndSaveToDB } = require('../../../utils/webscrapers/scrapers/scrapers_utils.js')
const fs = require('fs')
const medicine = require('../../../utils/dbmodels/medicine.js')

// -------------- IMPORT SCRAPERS --------------
const noi = require('../../../utils/webscrapers/scrapers/noi.js')
const daymascotas = require('../../../utils/webscrapers/scrapers/daymascotas.js')

module.exports = function (req, res) {
    // Render the view and send the corresponding messages depending on the action executed
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

    // Run all the scrapers with their promisified functions
    function execAll (callback) {
        let t0 = time()

        let dayMascotasScraper = new Promise (function (resolve, reject) {
            daymascotas.scraper().then(function (data) {
                saveObjectToDB(data, 'Medicine', 'Brand', 'Day Mascotas', function (err, counter) {
                    resolve(counter)
                    reject(err)
                })
            })
        })

        let noiScraper = new Promise (function (resolve, reject) {
            noi.scraper().then(function (data) {
                saveObjectToDB(data, 'Medicine', 'Brand', 'Noi', function (err, counter) {
                    resolve(counter)
                    reject(err)
                })
            })
        })

        let resolvedPromisesArray = [
            dayMascotasScraper,
            noiScraper
        ]

        Promise.all(resolvedPromisesArray).then(function (values) {
            let duration = time(t0)
            console.log('Executing all the scrapers took: ' + duration + ' miliseconds.')
            let total = 0
            for (let i = 0; i < values.length; i++) {
                total += values[i]
            }
            callback(null, total)
        }).catch(function (err) {
            console.error(err)
            callback(err)
        })
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

    switch (executeMeds) {
        case 'all':
            medicine.findAll(function (err, meds) {
                // If there are documents on the db first erase them and the execute the scraper
                if (meds.length !== 0) {
                    medicine.deleteMany('store', '', function (err, DeleteWriteOpResultObject) {
                        console.log('Deleted ' + DeleteWriteOpResultObject.deletedCount + ' documents from the meds colleciton...')
                        execAll(function (err, docCounter) {
                            renderMeds(err, 'execute', docCounter)
                        })  
                    })
                } else {
                // If there are none documents just execute the scraper
                    execAll(function (err, docCounter) {
                        renderMeds(err, 'execute', docCounter)
                    }) 
                }
            })
            break;
        case 'daymascotas':
            let t0 = time()
            daymascotas.scrapercb(function (err, data) {
                let t1 = time(t0)
                console.log('Day Mascotas scraper took: ' + t1 + ' miliseconds.')
                const t2 = process.hrtime()
                saveObjectToDB(data, 'Medicine', 'Brand', 'Day Mascotas', function (err, counter) {
                    const t3 = process.hrtime(t2)
                    console.log('Saving Day Mascotas data to the DB took: ' + (t3[0]*1000 + (t3[1]/1000000)) + ' miliseconds.')
                    renderMeds(err, 'execute', counter)
                })
            })
            // executeAndSaveToDB('Day Mascotas', daymascotas.scrapercb, function (err, counter) {
            //     renderMeds(err, 'execute', counter)
            // })
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
}