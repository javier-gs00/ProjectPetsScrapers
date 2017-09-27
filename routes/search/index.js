const search = require('express').Router()
const MedModel = require('../../utils/dbmodels/medicine.js').MedModel

// (READ) Search form route and return data
search.get('/', function (req, res) {
    MedModel.find({name: new RegExp(req.query.query, 'i')}, function (err, meds) {
        res.render('home', {med: meds})
    })
})

module.exports = search