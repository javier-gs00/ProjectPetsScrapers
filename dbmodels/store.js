function storeObject () {
    
}

let storeSchema = mongoose.Schema({
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

let storeModel = mongoose.model('stores', storeSchema)

module.exports = storeSchema
module.exports = storeModel