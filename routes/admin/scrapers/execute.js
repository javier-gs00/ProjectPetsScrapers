const fs = require('fs')
const formidable = require('formidable')

// -------------- IMPORT MODELS --------------
const { saveObjectToDB, executeAndSaveToDB, JsonToObject } = require('../../../utils/webscrapers/scrapers/scrapers_utils.js')
const medicine = require('../../../utils/dbmodels/medicine.js')

// -------------- IMPORT SCRAPERS --------------
const noi = require('../../../utils/webscrapers/scrapers/noi.js')
const daymascotas = require('../../../utils/webscrapers/scrapers/daymascotas.js')

module.exports = function (req, res) {
    // create an incoming form object
    let form = new formidable.IncomingForm()
    
    form.multiples = true
    form.uploadDir = res.locals.dirname + '/uploads'
    form.keepExtensions = true

    form.on('error', function (err) {
        renderMeds(err, '', 0)
    })

    form.on('fileBegin', function (name, file) {
        if (file.name !== 'data.json') {
            console.log(file.name)
            // return renderMeds(null, 'execute', 0)
        } else {
            file.path = res.locals.dirname + '/uploads/' + file.name
        }
    })

    form.parse(req, function (err, fields, files) {
        if (err) return renderMeds(err, '', 0)
        console.log('fields object is: ')
        console.log(fields)

        let deleteMeds = fields.deleteMeds
        let executeMeds = fields.executeMeds
        let execute = fields.execute

        switch (deleteMeds) {
            case 'all':
                medicine.deleteMany('store', '', function (err, DeleteWriteOpResultObject) {
                    renderMeds(err, 'delete', DeleteWriteOpResultObject.deletedCount)
                })
                break;
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
                    // If there are documents on the db first erase them and then execute the scraper
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
                daymascotas.scraper()
                .then(function (data) {
                    return saveObjectToDB(data, 'Day Mascotas')
                }).then(function (counter) {
                    return renderMeds(err, 'execute', counter)
                }).catch(function (err) {
                    return renderMeds(err, '', 0)
                })
                break;
            case 'noi':
                let start = time()
                noi.scraper()
                .then(function (data) {
                    // let duration = time(start)
                    // console.log('Day Mascotas scraper took: ' + duration + ' miliseconds.')
                    // let startdb = time()
                    return saveObjectToDB(data, 'Noi')
                }).then(function (counter) {
                    // let durationdb = time(startdb)
                    // console.log('Saving Day Mascotas data to the db took: ' + durationdb + ' miliseconds.')
                    return renderMeds(err, 'execute', counter)
                }).catch(function (err) {
                    return renderMeds(err, '', 0)
                })
                break;
        }

        switch (execute) {
            case 'toJson':
                medicine.dbToJson(res.locals.dirname, 'scraped_meds.json', function (err) {
                    res.render('scrapers', {
                        dbToJson: true
                    })
                })
                break;
            case 'loadJson':
                JsonToObject(res.locals.dirname + '/utils/webscrapers/scrapers/scrapers_json_files/', 'scraped_meds.json')
                .then(function (obj) {
                    // console.log(obj)
                    return saveObjectToDB(obj, '')
                }).then(function (counter) {
                    console.log('--------------- loadJson saveObjToDb Counter: ---------------')
                    console.log(counter)
                    renderMeds(err, 'execute', counter)
                })
                .catch(function (err) {
                    console.log('--------------- loadJson JsonToObj Err: ---------------')
                    console.log(err)
                    renderMeds(err, '', 0)
                })
                break;
            case 'uploadJson':
                JsonToObject(res.locals.dirname + '/uploads/', 'data.json')
                .then(function (obj) {
                    // console.log(obj)
                    return saveObjectToDB(obj, '')
                }).then(function (counter) {
                    console.log('--------------- uploadJson saveObjToDb Counter: ---------------')
                    console.log(counter)
                    renderMeds(err, 'execute', counter)
                })
                .catch(function (err) {
                    console.log('--------------- uploadJson JsonToObj Err: ---------------')
                    console.log(err)
                    renderMeds(err, '', 0)
                })
                break;
        }
    })

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
}