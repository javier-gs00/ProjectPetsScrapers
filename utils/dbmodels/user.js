const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectiveId = Schema.ObjectiveId

let UserSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
})

let UserModel = mongoose.model('users', UserSchema)

function findByUsername (data, cb) {
    UserModel.findOne({ username: data }, function (err, user) {
        cb(err, user)
    })
}

function findByEmail (data, cb) {
    UserModel.find({ email: data }, function (err, result) {
        cb(err, result)
    })
}

function findById (id, cb) {
    UserModel.findById(id, function (err, user) {
        cb(err, user)
    })
}

function save (username, password, email, cb) {
    let newUser = new UserModel({
        username: username,
        password: password,
        email: email
    })

    newUser.save(function (err, newUser) {
        if (err) {
            console.log(err)
            return
        } else {
            cb(err, newUser)
        }
    })
}

module.exports = {
    findByUsername,
    findByEmail,
    findById,
    save
}