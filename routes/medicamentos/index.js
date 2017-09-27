const medicamentos = require('express').Router()
const MedModel = require('../../utils/dbmodels/medicine.js').MedModel

// READ and show all medicine data
medicamentos.get('/', function (req, res) {
    MedModel.find().exec(function (err, medicamentos) {
        res.render('medicamentos', {
            product: medicamentos
        })
    })
})

module.exports = medicamentos