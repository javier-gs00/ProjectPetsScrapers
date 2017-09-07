const alimentos = require('express').Router()

// READ and show all food data
alimentos.get('/', function (req, res) {
    res.render('alimentos')
})

module.exports = alimentos