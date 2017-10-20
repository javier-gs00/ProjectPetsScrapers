const medicamentos = require('express').Router()
const Meds = require('../../utils/dbmodels/medicine.js')

// READ and show all medicine data
medicamentos.get('/', function (req, res) {
    // MedModel.find().exec(function (err, medicamentos) {
    //     res.render('medicamentos', {
    //         product: medicamentos
    //     })
    // })
    Meds.findAll(function (err, meds) {
        res.render('medicamentos', {
            product: meds
        })
    })
})

module.exports = medicamentos