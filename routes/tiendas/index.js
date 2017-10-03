const tiendas = require('express').Router()
const single = require('./single')
const filter = require('./filter')
const StoreModel = require('../../utils/dbmodels/store.js').StoreModel

tiendas.get('/', filter)

tiendas.get('/:name', single)

module.exports = tiendas