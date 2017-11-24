const mongoose = require('mongoose')
const fs = require('fs')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

let MedSchema = new Schema({
    name: String,
    price: Number,
    href: String,
    image_href: String,
    store: String,
    date: { type: Date, default: Date.now}
})

const MedModel = mongoose.model('meds', MedSchema)

function Medicine (name, price, link, category, brand, image, store, date) {
    this.name = name;
    this.price = price;
    this.link = link;
    this.image = image;
    this.store = store;
    this.date = date;
}

// Find medicine by name
function find (query, cb) {
    MedModel.find({ name: new RegExp(query, 'i')}, function (err, meds) {
        cb(err, meds)
    })
}

// Retrieve all the documents
function findAll (cb) {
    MedModel.find().exec(function (err, meds) {
        cb(err, meds)
    })
}

// Sort results by category and order, wich is given in the 'sort' parameter
// 'sort' is composed of a category and a + or - for order. e.g: 'name' or '-name'
function sort (query, sort, callback) {
    MedModel.find({ name: new RegExp(query, 'i') }).sort(sort).exec(
        callback
    )
}

// Delete documents from the database
function deleteMany (category, criteria) {
    return new Promise (function (resolve, reject) {
        console.log("Criteria is: " + category)
        console.log("Criteria is: " + criteria)   
        if (category === '') {
            MedModel.deleteMany({}, function (err, res) {
                resolve(res)
                reject(err)
            })
        } else if (category === 'name') {
            MedModel.deleteMany({ name: criteria}, function (err, DeleteWriteOpResultObject) {
                resolve(DeleteWriteOpResultObject)
                reject(err)
            })
        } else if (category === 'store') {
            MedModel.deleteMany({ store: criteria}, function (err, res) {
                resolve(res)
                reject(err)
            })
        } else {
            reject({err: 'deleteMany function error'})
        }
    })
}

// Export all scraped med data from the DB to a JSON file
function dbToJson (path, filename, callback) {
    findAll(function (err, results) {
        let resJson = JSON.stringify(results, null, 2)

        let location = path + '/utils/webscrapers/scrapers/scrapers_json_files/' + filename

        fs.writeFile(location, resJson, function (err) {
            console.log('JSON created')
            callback(err)
        })
    })
}

// Save the scraped data of a particular store
function save (data, store) {
    return new Promise (function (resolve, reject) {
        checkData(data)
        .then(function (data) {
            let counter = 0
            let date = getDate()
    
            data.forEach(function(med) {
                let storeName = (med.store)? med.store : store
                
                //Transform price in string to number
                if (typeof med.price === "string") {
                    med.price = med.price.replace(/\$/g, '')
                    med.price = med.price.replace(/\,/g, '')
                    med.price = med.price.replace(/\./g, '')
                    parseInt(med.price)
                }
    
                let medDocument = new MedModel ({
                    name: med.name,
                    price: med.price,
                    href: med.link,
                    image_href: med.image,
                    store: storeName,
                    date: date
                })
    
                medDocument.save(function (err, medDocument) {
                    if (err) reject(err)
                })
    
                counter += 1
            })
    
            resolve(counter)
        })
        .catch(function (err) {
            reject(err)
        })
    })
}

// Transform data from a JSON file to a JS Object
function parseJson (path, filename) {
    return new Promise (function (resolve, reject) {
        let location = path + filename

        fs.readFile(location, 'utf8', function (err, data) {
            let obj = JSON.parse(data)
            resolve(obj)
            reject(err)
        })
    })
}

// Check that the scraped data contains vaules for name, price and href
function checkData (data) {
    return new Promise(function (resolve, reject) {
        let err = null

        data.forEach(function (med) {
            if (med.name === '' || med.price === '' || med.link === '') {
                err = 'Incomplete scraped data'
                reject(err)
            }
        })
        resolve(data)
    })
}

function getDate() {
    let date = new Date()

    // Get the day as a string in format: YYYY/MM/DD
    let today = date.getFullYear() + '/' + (date.getMonth() + 1 ) + '/' + date.getDate()
    return today 
}

module.exports = {
    dbToJson,
    deleteMany,
    find,
    findAll,
    Medicine,
    MedModel,
    parseJson,
    save,
    sort
}