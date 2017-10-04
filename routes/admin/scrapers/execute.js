const noi = require('../../../utils/webscrapers/scrapers/noi.js')
const savecollection = require('../../../utils/webscrapers/utils/savecollection.js')
const fs = require('fs')

module.exports = function (req, res) {
    noi.scraper(res.locals.dirname + '/utils/webscrapers/scrapers/scrapers_json_files/medsnoi.json')

    res.render('scrapers', {
        success: true
    })
}