const servicios = require('express').Router()

// READ and show all services data
servicios.get('/', function (req, res) {
    res.render('servicios')
})

module.exports = servicios