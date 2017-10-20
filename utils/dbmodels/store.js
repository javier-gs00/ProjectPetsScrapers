const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let StoreSchema = mongoose.Schema({
    brand_name: String,
    location_name: String,
    website: String,
    address_street: String,
    address_commune: String,
    address_region: String,
    phone1: Number,
    phone2: Number,
    email: String,
    food_shop: String,
    med_shop: String,
    shipping: String,
    clinic: String
})

let StoreModel = mongoose.model('stores', StoreSchema)

function findAll (cb) {
    StoreModel.find().exec(function (err, stores) {
        cb(err, stores)
    })
}

function find (commune, region, cb) {
    StoreModel.find({
        address_commune: new RegExp(commune, 'i'),
        address_region: new RegExp(region, 'i')
    }, function (err, stores) {
        cb(err, stores)
    })
}

function save (
    brand_name,
    location_name,
    website,
    address_street,
    address_commune,
    address_region,
    phone1,
    phone2,
    email,
    food_shop,
    med_shop,
    shipping,
    clinic,
    cb
){
    let newStore = new StoreModel ({
        brand_name: brand_name,
        location_name: location_name,
        website: website,
        address_street: address_street,
        address_commune: address_commune,
        address_region: address_region,
        phone1: phone1,
        phone2: phone2,
        email: email,
        food_shop: food_shop,
        med_shop: med_shop,
        shipping: shipping,
        clinic: clinic
    })

    newStore.save(function (err, newStore) {
        if (err) {
            console.log(err)
        } else {
            console.log('DB INSERT Store -- location_name: ' + newStore.location_name + ' -- id: ' + newStore._id)
            cb(null, newStore)
        }
    })
}

function findById (id, cb) {
    StoreModel.findById(id, function (err, store) {
        cb(err, store)
    })
}

function findByIdAndUpdate (id, data, cb) {
    StoreModel.findByIdAndUpdate(id, data, function (err, store) {
        cb(err, store)
    })
}

function findByIdAndRemove (id, cb) {
    let storeName = function () {
        return new Promise (function (resolve, reject) {
            findById(id, function (err, store) {
                name = (store.location_name)? store.location_name : 'NA'
                resolve(name)
                reject(err)
            })
        })
    }

    storeName().then(function (name) {
        StoreModel.findByIdAndRemove(id, function (err) {
            console.log("remove name: " + name)
            let storename = name
            if (err) {
                console.log(err)
            } else {
                console.log('storename: ' + storename)
                cb(err, storename)
            }
        })
    })
}

module.exports = {
    findAll,
    find,
    save,
    findById,
    findByIdAndUpdate,
    findByIdAndRemove
}