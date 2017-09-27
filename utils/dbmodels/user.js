const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectiveId = Schema.ObjectiveId

let UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

UserModel = mongoose.model('users', UserSchema)

module.exports.UserModel = UserModel