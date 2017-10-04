const scrapers = require('express').Router()
const show = require('./show')
const execute = require('./execute')

scrapers.get('/', show)

scrapers.post('/', execute)

module.exports = scrapers