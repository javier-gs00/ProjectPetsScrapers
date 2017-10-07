const save = require('../../../utils/webscrapers/utils/save_to_db.js').save
const fs = require('fs')

// -------------- IMPORT SCRAPERS --------------
const noi = require('../../../utils/webscrapers/scrapers/noi.js'),
        daymascotas = require('../../../utils/webscrapers/scrapers/daymascotas.js')

module.exports = function (req, res) {

    function scraperExec (callback) {
        let noiScraper = noi.scraper()
        let daymascotasScraper = daymascotas.scrapper()
        let execCounter = 0

        noiScraper.then(function (medList) {
            save(medList, function (err, counter) {
                console.log('Noi scraper saved ' + counter + ' documents in the meds collection')
                execCounter += 1
            })
        })
    
        daymascotasScraper.then(function (medList) {
            save(medList, function (err, counter) {
                console.log('Day Mascotas scraper saved ' + counter + ' documents in the meds collection')
                execCounter += 1
                callback(null, execCounter)
            })
        })
    
        noiScraper.catch(function (err) {
            console.log('Noi ERR: ' + err)
            res.render('scrapers', {
                success: false
            })
        })
    
        daymascotasScraper.catch(function (err) {
            console.log('Day Mascotas ERR: ' + err)
            res.render('scrapers', {
                success: false
            })
        })
    }

    scraperExec(function (err, execCounter) {
        console.log('counter is ' + execCounter)
        if (execCounter === 2) {
            res.render('scrapers', {
                success: true
            })
        }
    })
}